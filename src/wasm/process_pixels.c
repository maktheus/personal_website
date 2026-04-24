/*
 * process_pixels.c — pixel loop compiled to WebAssembly (wasm32, no libc)
 *
 * For each cell in the pixelation grid this computes:
 *   bNorm  — normalised brightness  [0..1]
 *   ry     — wave-distorted y position (pixels)
 *   size   — glyph half-size (pixels)
 *
 * Results are written into out[] as three consecutive floats per cell.
 * The caller (JS Worker) does the final Canvas 2D draw calls.
 *
 * Compile:
 *   clang --target=wasm32 -nostdlib -Wl,--no-entry \
 *         -Wl,--export=process_cells \
 *         -Wl,--export=get_px_ptr \
 *         -Wl,--export=get_out_ptr \
 *         -O3 -o process_pixels.wasm process_pixels.c
 */

typedef unsigned char  u8;
typedef unsigned int   u32;
typedef float          f32;

/* ------------------------------------------------------------------ */
/* Static buffers — avoids malloc; size covers any practical canvas.  */
/* MAX_CELLS = 200 cols * 100 rows = 20 000 cells                     */
/* ------------------------------------------------------------------ */
#define MAX_CELLS 20000

static u8  px_buf[MAX_CELLS * 4];      /* RGBA input  */
static f32 out_buf[MAX_CELLS * 3];     /* [bNorm, ry, size] output */

/* JS reads these pointers to know where to copy pixel data in/out */
__attribute__((export_name("get_px_ptr")))
u8* get_px_ptr(void) { return px_buf; }

__attribute__((export_name("get_out_ptr")))
f32* get_out_ptr(void) { return out_buf; }

/* ------------------------------------------------------------------ */
/* Fast sin approximation — Bhaskara I formula (max error ~0.17 %)    */
/* Good enough for a visual wave; avoids importing libm.              */
/* ------------------------------------------------------------------ */
static f32 fast_sinf(f32 x) {
    /* Reduce to [0, 2*PI) */
    const f32 PI     = 3.14159265f;
    const f32 TWO_PI = 6.28318530f;
    /* Integer floor via truncation toward zero */
    f32 k = (f32)(int)(x / TWO_PI);
    x -= k * TWO_PI;
    if (x < 0.0f) x += TWO_PI;

    /* Reflect to [0, PI] and track sign */
    f32 sign = 1.0f;
    if (x > PI) { x -= PI; sign = -1.0f; }

    /* Bhaskara: sin(x) ≈ 16x(PI-x) / (5*PI² - 4x(PI-x)) */
    f32 num = 16.0f * x * (PI - x);
    f32 den = 5.0f * PI * PI - 4.0f * x * (PI - x);
    return sign * num / den;
}

/* ------------------------------------------------------------------ */
/* fast_fmodf — positive-safe modulo for the scroll offset            */
/* ------------------------------------------------------------------ */
static f32 fast_fmodf(f32 x, f32 y) {
    return x - (f32)(int)(x / y) * y;
}

/* ------------------------------------------------------------------ */
/* process_cells — main entry point called from the JS Web Worker     */
/*                                                                    */
/* cols, rows  — grid dimensions (W/STEP, H/STEP)                     */
/* audioVolume — normalised audio energy [0..1]                       */
/* time_val    — monotonic animation clock                            */
/* H_f         — canvas height in CSS pixels (for scroll wrap)        */
/* step        — grid cell size in pixels (typically 24)              */
/* ------------------------------------------------------------------ */
__attribute__((export_name("process_cells")))
void process_cells(
    int cols, int rows,
    f32 audioVolume, f32 time_val, f32 H_f,
    int step
) {
    const f32 step_f   = (f32)step;
    const f32 scroll   = fast_fmodf(time_val * 10.0f, H_f);
    const f32 wave_amp = audioVolume * 30.0f;

    for (int y = 0; y < rows; y++) {
        const f32 y_base = (f32)y * step_f;

        for (int x = 0; x < cols; x++) {
            const int cell = y * cols + x;
            const int i    = cell * 4;

            /* Brightness normalisation: (R+G+B) / 765 */
            const f32 bNorm =
                ((f32)px_buf[i] + (f32)px_buf[i + 1] + (f32)px_buf[i + 2])
                / 765.0f;

            /* Wave-scroll y position */
            const f32 waveY = fast_sinf((f32)x * 0.1f + time_val) * wave_amp;
            const f32 ry    = fast_fmodf(y_base + waveY - scroll + H_f, H_f);

            /* Glyph size driven by brightness and audio */
            const f32 size  = bNorm * 4.0f + audioVolume * 10.0f * bNorm;

            out_buf[cell * 3 + 0] = bNorm;
            out_buf[cell * 3 + 1] = ry;
            out_buf[cell * 3 + 2] = size;
        }
    }
}

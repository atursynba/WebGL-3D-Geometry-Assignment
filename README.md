# WebGL 3D Geometry Assignment (Variant 21)

An interactive WebGL 1.0 web application demonstrating 2.5D depth offset projection, custom vertex color interpolation, and depth buffer testing.

---

## Variant Details & Parameters

* **Student ID Ending:** `21`
* **Offset Formula Parameters:**
  * Second-to-last digit (`2`): $2 \bmod 4 = 2 \implies (o_x, o_y) = (+0.15, -0.15)$
  * Depth Projection: Bottom and Right faces visible
* **Assigned 3D Solid:** Triangular Prism ($24$ vertices, $5$ faces)
* **First Shape:** Cube ($36$ vertices, $6$ faces)

---

## 🛠️ Features

* **3D Coordinate Processing:** Handles 3-component vertex positions (`x`, `y`, `z`) passed via WebGL attributes.
* **Color Interpolation:** Combines multi-color gradient faces using varying qualifiers with solid color faces.
* **Depth Testing:** Toggles depth testing (`gl.DEPTH_TEST`) with `gl.LEQUAL` depth comparison function.
* **Interactive Controls:** Real-time state updates using keyboard listeners.

---

## Keyboard Controls

| Key | Action | Description |
| :---: | :---: | :--- |
| **1** | `gl.TRIANGLES` | Default solid rendering mode |
| **2** | `gl.LINE_LOOP` | Wireframe outline mode |
| **3** | `gl.LINES` | Line segment rendering |
| **4** | `gl.LINE_STRIP` | Connected line strip mode |
| **5** | `gl.POINTS` | Vertex point display |
| **6** | `gl.TRIANGLE_STRIP` | Connected triangle strip mode |
| **D** | Toggle Depth | Switch Depth Testing (`ON` / `OFF`) |
| **S** | Swap Order | Toggle draw order (Cube First vs. Solid First) |

---

## File Structure

```text
assik1VR/
├── index.html    # Entry HTML structure & canvas setup
├── index.js      # Shader sources, WebGL context, geometry generators & event listeners
└── README.md     # Project documentation

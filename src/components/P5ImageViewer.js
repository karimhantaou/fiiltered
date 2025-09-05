// P5ImageViewer.jsx
import React, { useRef, useEffect } from "react";
import Sketch from "react-p5";

const pageWidth = window.innerWidth;
const pageHeight = window.innerHeight;

export default function P5ImageViewer({
                                          defaultSrc = "../assets/default/default.png",
                                          width = pageWidth * 0.6,
                                          height = pageHeight * 0.6,
                                          className = "canva",
                                      }) {
    const p5Ref = useRef(null);
    const imgRef = useRef(null);

    const cornerWeight = 2;

    const preload = (p) => {
        imgRef.current = p.loadImage(defaultSrc);
    };

    const setup = (p, canvasParentRef) => {
        // ⚠️ s'assurer qu'il n'y a pas déjà un canvas
        if (p5Ref.current) {
            p5Ref.current.remove(); // détruit le précédent
        }
        p5Ref.current = p;
        p.createCanvas(width, height).parent(canvasParentRef);
        p.noLoop();
        p.redraw();
    };

    const draw = (p) => {
        const img = imgRef.current;
        p.background(240);
        p.stroke("black");
        p.strokeWeight(cornerWeight);

        // coins du canvas
        p.line(p.width - cornerWeight, p.height - cornerWeight, p.width - 30, p.height - cornerWeight);
        p.line(p.width - cornerWeight, p.height - cornerWeight, p.width - cornerWeight, p.height - 30);
        p.line(cornerWeight, cornerWeight, 30, cornerWeight);
        p.line(cornerWeight, cornerWeight, cornerWeight, 30);

        if (!img) return;

        const realImgWidth = img.width;
        const realImgHeight = img.height;

        // calcul d'échelle sans resize destructif
        const maxH = p.height - 200;
        const scale = Math.min(1, maxH / realImgHeight, p.width / realImgWidth);
        const dispW = realImgWidth * scale;
        const dispH = realImgHeight * scale;
        const x = p.width / 2 - dispW / 2;
        const y = p.height / 2 - dispH / 2;

        p.image(img, x, y, dispW, dispH);

        // repères autour de l’image
        p.line(x + dispW + 5, y - 5, x + dispW + 5, y + 30);
        p.line(x + dispW + 5, y - 5, x + dispW - 30, y - 5);
        p.line(x - 5, y + dispH + 5, x - 5, y + dispH - 30);
        p.line(x - 5, y + dispH + 5, x + 30, y + dispH + 5);

        // affichage résolution
        p.strokeWeight(0);
        p.text(`${realImgWidth} px`, x - 55, y + dispH - 7);
        p.text(`${realImgHeight} px`, x - 5, y + dispH + 25);
    };

    const handleImage = (e) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith("image")) return;
        const reader = new FileReader();
        reader.onload = () => {
            const p = p5Ref.current;
            if (!p) return;
            p.loadImage(reader.result, (loaded) => {
                imgRef.current = loaded;
                p.redraw();
            });
        };
        reader.readAsDataURL(file);
    };

    // cleanup quand le composant est démonté
    useEffect(() => {
        return () => {
            if (p5Ref.current) {
                p5Ref.current.remove();
            }
        };
    }, []);

    return (
        <div className={`${className}`}>

            <input
                id="imageInput"
                className="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImage}
            />

            <Sketch preload={preload} setup={setup} draw={draw} />

            <div className={"option"}>
                <div className={"algorithm"}>
                    <h1>Alorithms</h1>
                </div>
                <div className={"setting"}>
                    <h1>Settings</h1>
                </div>
            </div>

        </div>
    );
}

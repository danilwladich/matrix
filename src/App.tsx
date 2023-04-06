import React, { useEffect, useRef, useState } from "react";
import "./App.css";

interface IRow {
	font: number;
	x: number;
	y: number;
	dropRate: number;
	symbolsCount: number;
	update: () => void;
}

const katakana = [
	"ァ",
	"ア",
	"ィ",
	"イ",
	"ゥ",
	"ウ",
	"ェ",
	"エ",
	"ォ",
	"オ",
	"カ",
	"ガ",
	"キ",
	"ギ",
	"ク",
	"グ",
	"ケ",
	"ゲ",
	"コ",
	"ゴ",
	"サ",
	"ザ",
	"シ",
	"ジ",
	"ス",
	"ズ",
	"セ",
	"ゼ",
	"ソ",
	"ゾ",
	"タ",
	"ダ",
	"チ",
	"ヂ",
	"ッ",
	"ツ",
	"ヅ",
	"テ",
	"デ",
	"ト",
	"ド",
	"ナ",
	"ニ",
	"ヌ",
	"ネ",
	"ハ",
	"バ",
	"パ",
	"ヒ",
	"ビ",
	"ピ",
	"フ",
	"ブ",
	"プ",
	"ヘ",
	"ベ",
	"ペ",
	"ホ",
	"ボ",
	"ポ",
	"マ",
	"ミ",
	"ム",
	"メ",
	"モ",
	"ャ",
	"ヤ",
	"ュ",
	"ユ",
	"ョ",
	"ヨ",
	"ラ",
	"リ",
	"ル",
	"レ",
	"ロ",
	"ヮ",
	"ワ",
	"ヰ",
	"ヱ",
	"ヲ",
	"ン",
	"ヴ",
	"ヵ",
	"ヶ",
	"ヷ",
	"ヸ",
	"ヹ",
	"ヺ",
];

function getRnd(min: number, max: number) {
	return Math.random() * (max - min + 1) + min;
}

function App() {
	const canvas = useRef<HTMLCanvasElement>(null);

	const [windowHeight, setWindowHeight] = useState(
		Math.min(window.innerHeight, document.documentElement.clientHeight)
	);
	const [windowWidth, setWindowWidth] = useState(
		Math.min(window.innerWidth, document.documentElement.clientWidth)
	);
	const [showSettings, setShowSettings] = useState(true);
	const [rowsCount, setRowsCount] = useState(10);
	const [rowsMinDropRate, setRowsMinDropRate] = useState(5);
	const [rowsMaxDropRate, setRowsMaxDropRate] = useState(20);
	const [rowsMinFont, setRowsMinFont] = useState(14);
	const [rowsMaxFont, setRowsMaxFont] = useState(22);
	const [rowsColor, setRowsColor] = useState({ r: 0, g: 200, b: 0 });
	const [symbols, setSymbols] = useState(katakana);

	// window resize
	useEffect(() => {
		function setScreenSize() {
			setWindowHeight(
				Math.min(window.innerHeight, document.documentElement.clientHeight)
			);
			setWindowWidth(
				Math.min(window.innerWidth, document.documentElement.clientWidth)
			);
		}

		window.addEventListener("resize", setScreenSize);
		return () => window.removeEventListener("resize", setScreenSize);
	}, []);

	// rows
	useEffect(() => {
		function row(this: IRow) {
			if (canvas.current !== null) {
				const ctx = canvas.current.getContext("2d")!;
				this.font = Math.floor(getRnd(rowsMinFont, rowsMaxFont));
				this.symbolsCount = Math.floor(getRnd(15, 25));
				this.x = getRnd(0, canvas.current.width - this.font);
				this.y = 0;
				this.dropRate = getRnd(rowsMinDropRate / 10, rowsMaxDropRate / 10);

				let rowSymbols: string[] = [];
				for (let i = 0; i < this.symbolsCount; i++) {
					rowSymbols.push(symbols[Math.floor(getRnd(0, symbols.length - 1))]);
				}

				this.update = () => {
					for (let i = 0; i < this.symbolsCount; i++) {
						ctx.font = `bold ${this.font}px serif`;

						const y = this.y - this.font * i;
						ctx.fillText(rowSymbols[i], this.x, y);

						const opacity = (this.symbolsCount - i) * (1 / this.symbolsCount);
						ctx.fillStyle = `rgba(${rowsColor.r}, ${rowsColor.g}, ${rowsColor.b}, ${opacity})`;
					}
				};
			}
		}

		function animateRows() {
			requestAnimationFrame(animateRows);
			if (canvas.current != null) {
				const ctx = canvas.current.getContext("2d")!;
				ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
				for (let i = 0; i < rows.length; i++) {
					rows[i].update();
					rows[i].y += rows[i].dropRate;
					if (
						rows[i].y - rows[i].symbolsCount * rows[i].font >
						canvas.current.height
					) {
						rows.splice(rows.indexOf(rows[i]), 1);
						rows.push(new (row as any)());
					}
				}
			}
		}

		let rows: IRow[] = [];
		for (let i = 0; i < rowsCount; i++) {
			rows.push(new (row as any)());
		}

		animateRows();
	}, [
		canvas,
		windowHeight,
		windowWidth,
		rowsCount,
		rowsMinDropRate,
		rowsMaxDropRate,
		rowsMinFont,
		rowsMaxFont,
		rowsColor,
		symbols,
	]);

	function setValue(
		fn: (value: React.SetStateAction<number>) => void,
		value: number,
		min: number,
		max: number
	) {
		if (value <= max && value >= min) {
			fn(value);
		}
	}

	return (
		<>
			<button
				onClick={() => setShowSettings((prev) => !prev)}
				className={"showSettings " + (showSettings ? "active" : "")}
			>
				{showSettings ? "hideSettings" : "showSettings"}
			</button>

			{showSettings && (
				<div className="settings">
					<div className="settings__item">
						rowsCount
						<input
							type="number"
							max={100}
							min={1}
							value={rowsCount}
							onChange={(e) =>
								setValue(setRowsCount, +e.target.value, 1, 100)
							}
						/>
					</div>

					<div className="settings__item">
						rowsMinDropRate
						<input
							type="number"
							max={rowsMaxDropRate}
							min={1}
							value={rowsMinDropRate}
							onChange={(e) =>
								setValue(
									setRowsMinDropRate,
									+e.target.value,
									1,
									rowsMaxDropRate
								)
							}
						/>
					</div>

					<div className="settings__item">
						rowsMaxDropRate
						<input
							type="number"
							max={100}
							min={rowsMinDropRate}
							value={rowsMaxDropRate}
							onChange={(e) =>
								setValue(
									setRowsMaxDropRate,
									+e.target.value,
									rowsMinDropRate,
									100
								)
							}
						/>
					</div>

					<div className="settings__item">
						rowsMinFont
						<input
							type="number"
							max={rowsMaxFont}
							min={1}
							value={rowsMinFont}
							onChange={(e) =>
								setValue(
									setRowsMinFont,
									+e.target.value,
									1,
									rowsMaxFont
								)
							}
						/>
					</div>

					<div className="settings__item">
						rowsMaxFont
						<input
							type="number"
							max={100}
							min={rowsMinFont}
							value={rowsMaxFont}
							onChange={(e) =>
								setValue(
									setRowsMaxFont,
									+e.target.value,
									rowsMinFont,
									100
								)
							}
						/>
					</div>

					<div className="settings__item">
						rowsColor
						<input
							type="number"
							max={255}
							min={0}
							value={rowsColor.r}
							onChange={(e) =>
								setRowsColor((prev) => ({ ...prev, r: +e.target.value }))
							}
						/>
						<input
							type="number"
							max={255}
							min={0}
							value={rowsColor.g}
							onChange={(e) =>
								setRowsColor((prev) => ({ ...prev, g: +e.target.value }))
							}
						/>
						<input
							type="number"
							max={255}
							min={0}
							value={rowsColor.b}
							onChange={(e) =>
								setRowsColor((prev) => ({ ...prev, b: +e.target.value }))
							}
						/>
					</div>

					<div className="settings__item">
						symbols
						<input
							type="text"
							value={symbols.join(",")}
							onChange={(e) => setSymbols(e.target.value.split(","))}
						/>
					</div>
				</div>
			)}

			<canvas
				className="canvas"
				ref={canvas}
				width={windowWidth}
				height={windowHeight}
			/>
		</>
	);
}

export default App;

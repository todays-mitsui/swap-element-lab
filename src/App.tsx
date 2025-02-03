import { useState, useEffect } from "react";
import styles from "./App.module.css";

const PALETTE = [
	"#ff6e61",
	"#4a8a98",
	"#fff2c2",
	"#e0f4ff",
	"#ffab91",
	"#5a9aa4",
	"#ffd7ab",
	"#c2e7ff",
	"#ffe8b8",
	"#69abb0",
	"#ffc49e",
	"#8ecff7",
	"#f4bba0",
	"#73d0d9",
	"#ff9a8d",
	"#a4d8f4",
	"#ffe180",
	"#6fbce1",
	"#f4c9b0",
	"#7ec9a6",
	"#f4d8c2",
	"#a8dba8",
	"#f4e1d0",
	"#d4eacb",
	"#ffcc85",
];

type MoveDirection = "up" | "down";

export default function App() {
	const [colors, setColors] = useState(PALETTE);
	const [height, setHeight] = useState(120);
	const [direction, setDirection] = useState<MoveDirection>("up");
	const [isFixed, setIsFixed] = useState(false);

	useEffect(() => {
		const { height, direction, isFixed, scroll } = parseSearch(location.search);
		height && setHeight(height);
		direction && setDirection(direction);
		setIsFixed(isFixed);
		scroll > 0 && window.scrollTo({ top: scroll });
	}, []);

	const handleSwap = (index: number) => {
		const newColors = [...colors];

		if (direction === "up") {
			[newColors[index], newColors[index - 1]] = [
				newColors[index - 1],
				newColors[index],
			];
		} else if (direction === "down") {
			[newColors[index], newColors[index + 1]] = [
				newColors[index + 1],
				newColors[index],
			];
		}

		setColors(newColors);
	};

	return (
		<div className={styles.container}>
			<div className={`${styles.list} ${styles[direction]}`}>
				{colors.map((color, index) => (
					<div
						className={styles.item}
						style={{
							height: `${height}px`,
							backgroundColor: color,
							overflowAnchor: isFixed ? "none" : "auto",
						}}
						key={color}
					>
						<h3>{color}</h3>
						<button
							type="button"
							className={styles.button}
							title={
								direction === "up"
									? "上の要素と入れ替える"
									: "下の要素と入れ替える"
							}
							onClick={() => handleSwap(index)}
						>
							{direction === "up" ? "↑" : "↓"}
						</button>
					</div>
				))}
			</div>

			<Controls
				height={height}
				minHeight={60}
				maxHeight={1000}
				isFixed={isFixed}
				direction={direction}
				onHeightChange={setHeight}
				onFixedChange={setIsFixed}
				onDirectionChange={setDirection}
			/>
		</div>
	);
}

// ========================================================================== //

interface ControlsProps {
	height: number;
	minHeight: number;
	maxHeight: number;
	isFixed: boolean;
	direction: MoveDirection;
	onHeightChange: (height: number) => void;
	onFixedChange: (isFixed: boolean) => void;
	onDirectionChange: (direction: MoveDirection) => void;
}

function Controls(props: ControlsProps) {
	return (
		<div className={styles.controls}>
			<fieldset>
				<legend>高さ(px)</legend>
				<input
					type="range"
					className={styles.slider}
					value={props.height}
					onChange={(e) => props.onHeightChange(Number(e.target.value))}
					min={props.minHeight}
					max={props.maxHeight}
				/>
			</fieldset>
			<fieldset>
				<legend>入替え時オプション</legend>
				<div>
					<label>
						<input
							type="checkbox"
							checked={props.isFixed}
							onChange={(e) => props.onFixedChange(e.target.checked)}
						/>
						スクロール位置固定
					</label>
				</div>
				<div>
					<label>
						<input
							type="radio"
							checked={props.direction === "up"}
							onChange={() => props.onDirectionChange("up")}
						/>
						↑ (上と入替え)
					</label>
					<label>
						<input
							type="radio"
							checked={props.direction === "down"}
							onChange={() => props.onDirectionChange("down")}
						/>
						↓ (下と入替え)
					</label>
				</div>
			</fieldset>
		</div>
	);
}

// ========================================================================== //

interface LocationSearch {
	height: number | null;
	direction: MoveDirection | null;
	isFixed: boolean;
	scroll: number;
}

function parseSearch(search: string): LocationSearch {
	const params = new URLSearchParams(search);

	const maybeHeight = params.get("height");
	let height = maybeHeight != null ? parseInt(maybeHeight, 10) : null;
	height = height != null && 60 <= height && height <= 1000 ? height : null;

	const maybeDirection = params.get("direction");
	const direction =
		maybeDirection != null && ["up", "down"].includes(maybeDirection)
			? (maybeDirection as MoveDirection)
			: null;

	const isFixed = params.get("fixed") === "true";

	const scroll = parseInt(params.get("scroll") ?? "0", 10);

	return { height, direction, isFixed, scroll };
}

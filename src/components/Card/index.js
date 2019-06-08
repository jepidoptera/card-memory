import React from "react";
import "./card.css";
function Card(props) {
    let style = {
        "left": props.x * (100 / props.sideLength) + "%",
        "top": props.y * (100 / props.sideLength) + "%",
        "width": 100 / props.sideLength + "%",
        "height": 100 / props.sideLength + "%",
    };
    // console.log(style);
    return (
        <div className="card" style={style} onClick={() => props.onClick(props.id)}>
            <img className="cardImg" alt="card" src={props.img} />
        </div>
    )
}
export default Card;

// jshint esversion: 6
import React, { Component } from "react";
import './App.css';
import Card from './components/Card';

// load all images from images folder
import CardImages from './components/CardImages';


class App extends Component {
    state = {
        cards: [],
        cardOrder: [],
        rightAnswers: 0,
        highScore: localStorage.getItem("highScore") || 0,
        difficulty: parseInt(localStorage.getItem("difficulty")) || 1,
        message: ["card memory game", "0 points"]
    }

    componentDidMount = () => {
        // put this cards object in state
        let cards = this.state.cards;
        let cardOrder = [];
        for (let i = 0; i < 25; i++) { cardOrder.push(i) };
        // make one card for each loaded image
        CardImages.forEach((image, i) => {
            cards[i] = { img: image, clicked: false, x: 0, y: 0, fall: 0 };
        });
        // console.log(cards);
        // set state
        this.setState({
            cards: cards,
            cardOrder: cardOrder,
            message: ["0 points", `high score ${this.state.highScore}`]
        });
        this.shuffle();
    };

    reset = () => {
        // reset cards
        let cards = this.state.cards;
        cards.forEach(card => {
            card.clicked = false;
        });
        // reset answers
        this.setState({
            rightAnswers: 0,
            message: ["0 points", `high score: ${this.state.highScore}`],
            cards: cards
        });
        // shuffle
        this.shuffle();
    };

    clickCard = (i) => {
        let cards = this.state.cards;
        let highScore = this.state.highScore;
        let rightAnswers = parseInt(this.state.rightAnswers);
        // console.log(cards);
        if (cards[i].clicked) {
            // fail
            this.setState({
                message: ["you already clicked that one.", "you lose."],
                highlight: "red"
            });

            let cards = this.state.cards;
            // cards fly in different directions
            cards.forEach(card => {
                card.fly = Math.random() * 0.1 - 0.05;
                card.fall = 0.1;
            });
            this.setState({ cards: cards });

            // all cards fall
            var cardFall = setInterval(() => {
                let cards = this.state.cards;
                cards.forEach(card => {
                    card.fall += 0.0225;
                    card.y += card.fall;
                    card.x += card.fly;
                });
                this.setState({ cards: cards });
            }, 50);
            
            // reset all cards
            setTimeout(() => {
                let cards = this.state.cards;
                // stop moving
                cards.forEach(card => { card.x = 0; card.y = 0; card.fall = 0; });
                clearInterval(cardFall);
                // new game
                this.reset();
                // apply card changes and clear style
                this.setState({ cards: cards, highlight: "" });
            }, 3000);
        }
        else {
            // good guess
            cards[i].clicked = true;
            rightAnswers++;
            highScore = (highScore >= rightAnswers) ? highScore : parseInt(highScore) + 1;
            localStorage.setItem("highScore", highScore);
            this.setState({
                message: ["so far so good...", `${rightAnswers} points`,  `high score: ${highScore}`],
                rightAnswers: rightAnswers,
                highScore: highScore,
                cards: cards
            });
            // else console.log(rightAnswers + " < " + winning);
            this.shuffle();
        }
        // is that it?? did we win??
        let winning = (this.state.difficulty + 2) * (this.state.difficulty + 2);
        if (rightAnswers == winning) {
            // yeah. we won.
            this.setState({ "message": ["Nice job.  You got them all!", "score: " + winning] })
            setTimeout(this.reset, 2000);
            return;
        }
    }

    shuffle = () => {
        // how many cards are we working with here?
        let sideLength = this.state.difficulty + 2;
        let totalCards = sideLength * sideLength;

        // randomly switch each card with another card
        let cards = this.state.cards;
        for (let i = 0; i < totalCards; i++) {
            let rand = Math.floor(Math.random() * totalCards);
            let placeholder = cards[i];
            cards[i] = cards[rand];
            cards[rand] = placeholder;
        }
        // set state
        this.setState({ cards: cards });
        console.log("shuffled");
    }

    selectDifficulty = (event) => {
        console.log("changed to: " + ['none', 'easy', 'medium', 'hard'][event.target.value]);
        // save to local storage
        localStorage.setItem("difficulty", event.target.value);
        // save to state
        this.setState({ "difficulty": parseInt(event.target.value) });
    }

    render() {
        // put the cards in a square
        let sideLength = this.state.difficulty + 2;
        let totalCards = sideLength * sideLength;
        let cstyle = this.state.highlight ? { "background-color": this.state.highlight } : {};
        return (
        <div className="App">
                <header id="infoPanel" style={cstyle} >
                    <p>card memory game</p>
                    {this.state.message.map((message, i) => <p key={i}>{message}</p>)}
                    <select id="diffSelect" onChange={this.selectDifficulty} defaultValue={['0', '1', '2', '3'][this.state.difficulty]}>
                        <option value="1">Easy</option>
                        <option value="2">Medium</option>
                        <option value="3">Hard</option>
                    </select>
                </header>
                <div id="gameArea">
                    <div id="cardTable">
                        {this.state.cards.map((card, i) => {
                            return ((i < totalCards)
                                ? (< Card id={i} onClick={this.clickCard} img={card.img} x={i % sideLength + card.x
                                    } y = { Math.floor(i / sideLength) + card.y} sideLength={sideLength} key = { i } alt = { 'card image'} ></Card>)
                                : <div key={i}></div>)
                        })}
                    </div>
                </div>
        </div>
    )}
}

export default App;

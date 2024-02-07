'use client'

import { useEffect, useState, useRef } from "react";
import GameTimer from "@/components/game-timer";
import GuessTaker from "@/components/guess-taker";
import GiveUpButton from "@/components/give-up-button";
 

// return true if the word is a complete word
function inDictionary(word, words_trie) {
    let node = words_trie;
    for (const char of word) {
       let nextNode = node[char];
       if (!nextNode) return false;
       node = nextNode;
    }
    return node._ === 1;
}
  
//return an array of all letters that lead to a complete word
function findNextLetters(word, words_trie) {
    let node = words_trie;
    for (const char of word) {
        let nextNode = node[char];
        node = nextNode;
    }

    let nextLetters = Object.keys(node);
    const index = nextLetters.indexOf("_");
    if (index > -1) { // only splice array when item is found
        nextLetters.splice(index, 1); // 2nd parameter means remove one item only
    }
    return nextLetters;
}

//return a randam lowercase letter
function getRandomLetter() {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];

    return randomLetter;
}
  
//return and array of the letter buttons that update the current word on click
function renderLetterButtons(optionsArray, currentWord, setCurrentWord, setAwaitingGuess) {
    let letterButtons = []
    for (const letter of optionsArray) {
        letterButtons.push(<button class="w-12 h-12" onClick={() => {setAwaitingGuess(true);setCurrentWord(currentWord + letter)}}>{letter}</button>)
    }
    return letterButtons
}

function calculateScore(wordLength, gaveUp, setGaveUp) {
    if (gaveUp) {
        setGaveUp(false);
        if (wordLength <= 3) {
            return 0;
        }
        else {
            return ((wordLength - 3))
        }
    }
    
    else {
        if (wordLength <= 3) {
            return 0;
        }
        else {
            return ((wordLength - 3) + 3)
        }
    }
}

export default function HomePage({ dictData }) {
  
    const [currentWord, setCurrentWord] = useState("");
    const [currentGuess, setCurrentGuess] = useState("");
    const [currentScore, setCurrentScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [nextOptions, setNextOptions] = useState([]);
    const [endWord, setEndWord] = useState(false);
    const [awaitingGuess, setAwaitingGuess] = useState(false);
    const [gaveUp, setGaveUp] = useState(false);
    const [highScore, setHighScore] = useState(0);

    //if the game has been started then once current word is changed trigger
    useEffect(() => {
        console.log(gameStarted);
        if (gameStarted) {

            //check if the word is long enough and a full word and if it is then trigger the end word effect
            if (currentWord.length >= 4 && inDictionary(currentWord, dictData)) {
                console.log("the word was long enough and ended");
                setEndWord(true);
            }

    
            //if the words is still being build then randomly set two of the next letters into the state
            else {
                console.log("word wasn't long and the end of a word wasn't found");

                try {
                    console.log("trying to find next letters");

                    let options = findNextLetters(currentWord, dictData);

                    console.log("found these options");
                    console.log(options);

                    //somtimes a small word that is short gets through
                    if (options.length == 0) {
                        console.log("options was empty so the end of the word is triggered")
                        setEndWord(true);
                    }

                    // Shuffle array
                    const shuffled = options.sort(() => 0.5 - Math.random());
        
                    // Get sub-array of first n elements after shuffled
                    let selected = shuffled.slice(0, 2);

                    if (currentWord.length == 1 && currentWord[0] == 'Q' && selected[1] != "U") {
                        selected[0] = "U";
                    }

                    console.log("picked these two: ")
                    console.log(selected);
                    
                    setNextOptions(selected);

                }

                //sometimes the end of the word isn't marked in the trie
                catch {
                    console.log("failed to get the letters options so trigger end of the word")
                    setEndWord(true);
                }
            }
        }
    }, [currentWord])

    //once a guess is submitted checks to see if the current word is the same as the guess and if it is it skips the guessing stage
    useEffect(() => {
        if (awaitingGuess && currentGuess.length > 0 && (currentWord == currentGuess.slice(0, currentWord.length))) {
            setAwaitingGuess(false);
        }
    }, [awaitingGuess])

    //if the word is ended then add 1 to the score and reset the current word
    useEffect(() => {
        if (gameStarted && endWord) {
            console.log("ending the word")
            setCurrentScore(currentScore + calculateScore(currentWord.length, gaveUp, setGaveUp));
            setCurrentWord(getRandomLetter());
            setEndWord(false);
            setCurrentGuess("");
            setAwaitingGuess(false);
        }
    }, [endWord])

    //reset score to 0 when game starts
    useEffect(() => {
        if (gameStarted) {
            setCurrentScore(0);
        }
        else {
            setHighScore(Math.max(currentScore, highScore));
        }
    }, [gameStarted])

    return (
        <div>
            <div>High score: {highScore}</div>
            <div>Current score: {currentScore}</div>
            <div>Current guess: {currentGuess}</div>
            <div>Current word: {currentWord}</div>
            

            {/* button that starts the game by setting current word to a random letter and then disappears */}
            <button onClick={() => {setCurrentWord(getRandomLetter());setGameStarted(true);}} className={`${gameStarted ? "hidden" : "visible"}`} >Start Game</button>

            <div className={`${gameStarted ? "visible" : "hidden"}`}>
                <GameTimer setGameStarted={setGameStarted} gameStarted={gameStarted}/>
                <div className={`${awaitingGuess ? "hidden" : "visible"}`}>
                    {renderLetterButtons(nextOptions, currentWord, setCurrentWord, setAwaitingGuess)}
                </div>
                <div className={`${awaitingGuess ? "visible" : "hidden"}`}>
                    <GuessTaker currentWord={currentWord} setCurrentGuess={setCurrentGuess} inDictionary={inDictionary} wordTrie={dictData} setAwaitingGuess={setAwaitingGuess}/>
                </div>
                <GiveUpButton setEndWord={setEndWord} setAwaitingGuess={setAwaitingGuess} setGaveUp={setGaveUp}/>
            </div>
        </div>
    )
}
'use client'

import { useEffect, useState, useRef } from "react";
 

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
    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    var randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];

    return randomLetter;
}
  
//return and array of the letter buttons that update the current word on click
function renderLetterButtons(optionsArray, currentWord, setCurrentWord) {
    let letterButtons = []
    for (const letter of optionsArray) {
        letterButtons.push(<button class="w-12 h-12" onClick={() => {setCurrentWord(currentWord + letter)}}>{letter}</button>)
    }
    return letterButtons
}

function calculateScore(wordLength) {
    if (wordLength <= 4) {
        return 1;
    }
    else {
        return ((wordLength - 3)**2)
    }
}

export default function HomePage({ dictData }) {
  
    const [currentWord, setCurrentWord] = useState("");
    const [currentGuess, setCurrentGuess] = useState("");
    const [currentScore, setCurrentScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [nextOptions, setNextOptions] = useState([]);
    const [endWord, setEndWord] = useState(false);

    //if the game has been started then once current word is changed trigger
    useEffect(() => {
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

    //if the word is ended then add 1 to the score and reset the current word
    useEffect(() => {
        if (gameStarted && endWord) {
            console.log("ending the word")
            setCurrentScore(currentScore + calculateScore(currentWord.length));
            setCurrentWord(getRandomLetter());
            setEndWord(false);
        }
    }, [endWord])

    return (
        <div>
            <div>Current word: {currentWord}</div>
            <div>Current guess: {currentGuess}</div>
            <div>Current score: {currentScore}</div>

            {/* button that starts the game by setting current word to a random letter and then disappears */}
            <button onClick={() => {setCurrentWord(getRandomLetter()); setGameStarted(true)}} className={`${gameStarted ? "hidden" : "visible"}`} >Start Game</button>

            <div className={`${gameStarted ? "visible" : "hidden"}`}>
                {renderLetterButtons(nextOptions, currentWord, setCurrentWord)}
            </div>
        </div>
    )
}
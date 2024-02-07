import { useEffect } from "react";

export default function GuessTaker({currentWord, setCurrentGuess, inDictionary, wordTrie, setAwaitingGuess}) {

    function handleGuess(e) {
        e.preventDefault();
        let guess = currentWord + e.target[0].value.toUpperCase()

        if (inDictionary(guess, wordTrie)) {
            setCurrentGuess(guess);
            setAwaitingGuess(false);
            e.target[0].value = ""
        }
        else {
            alert("that word is not in the dictionary. Try again");
            e.target[0].value = ""
        }
    }

    return (
        <div>
            <form onSubmit={handleGuess}> 
                <div className="inline-block">{currentWord}</div>
                <input className="text-black" style={{textTransform: 'uppercase'}} type="text" id="guessEnd" name="guessEnd" />
                <input type="submit" />
            </form>
        </div>
    )
}

export default function GiveUpButton({setEndWord, setAwaitingGuess, setGaveUp}) {
    
    function giveUp(){
        setGaveUp(true);
        setAwaitingGuess(false);
        setEndWord(true);
    }

    return(
        <div>
            <button onClick={giveUp}>Give Up</button>
        </div>
    )
}
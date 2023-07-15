import { CSSProperties, SyntheticEvent, useState } from "react";
import { MailDetailsAndStatus } from "./App";
import { isatty } from "tty";

interface Props {
    miniEmailContents: MailDetailsAndStatus,
    activeEmail: number
    miniEmailCardID: string,
    markAsRead: Function
}
function MiniEmailDisplayCard({ miniEmailContents, activeEmail, miniEmailCardID, markAsRead }: Props) {
    const markEmailAsRead: Function = (event: SyntheticEvent, miniEmailCardID: string, mainID: string) => {
        const anyActiveCard: HTMLElement | null = document.querySelector('.borderAccent');
        const miniEmailCard: HTMLElement | null = document.getElementById(miniEmailCardID);
        if(anyActiveCard!==miniEmailCard){
            markAsRead(miniEmailCardID, mainID);
        }
    }
    let index:number=parseInt(miniEmailCardID.split('-')[1]);
    return (
        <div className={activeEmail===index?`borderAccent miniEmail ${miniEmailContents.status}`:`miniEmail ${miniEmailContents.status}`} id={miniEmailCardID} onClick={event => markEmailAsRead(event, miniEmailCardID, miniEmailContents.miniEmail.id)}>
            <div className="userLogoOuter">
                <div className="userLogo">
                    {miniEmailContents.miniEmail.from.name.charAt(0).toUpperCase()}
                </div>
            </div>
            <div className="miniEmailContents">
                <div className="senderDetails">
                    <span>From:</span>
                    <span><b>{miniEmailContents.miniEmail.from.name}</b></span>
                    <span><b>{'<'}{miniEmailContents.miniEmail.from.email}{'>'}</b></span>
                </div>
                <div className="subject">
                    <span>Subject:</span>
                    <span><b>{miniEmailContents.miniEmail.subject}</b></span>
                </div>
                <span className="description">
                    {miniEmailContents.miniEmail.short_description}
                </span>
                <div className="dateTimeAndFavorite">
                    <span className="datetime">
                        {miniEmailContents.dateTime}
                    </span>
                    {
                        miniEmailContents.isFav===true?
                        <button className='showFavorite' id={`favorite-${miniEmailCardID}`}>Favorite</button>
                        : 
                        null
                    }
                </div>
            </div>
        </div >
    )
}
export default MiniEmailDisplayCard;
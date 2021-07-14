import copyImg from '../../assets/images/copy.svg';

import './styles.scss'

type RoomCodeProps = {
    code: string;
    theme: string;
}

export function RoomCode(props: RoomCodeProps) {

    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code)
    }

    return (
        <button className={`room-code ${props.theme}`} onClick={copyRoomCodeToClipboard}>
            <div>
                <img src={copyImg} alt="Copy room code" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    )
}
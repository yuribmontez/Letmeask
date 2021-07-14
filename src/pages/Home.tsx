import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { Button } from '../components/Button';
import toast, { Toaster } from 'react-hot-toast';
import Switch from "react-switch";


import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import logoDark from '../assets/images/logo-dark.svg'
import googleIconImg from '../assets/images/google-icon.svg'


import '../styles/auth.scss';

export function Home() {
    const history = useHistory();
    const { theme, toggleTheme } = useTheme();
    const { user, signInWithGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function handleCreateRoom() {
        if (!user) {
            await signInWithGoogle()
        }

        history.push('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if (!roomRef.exists()) {
            toast.error('Room does not exists.', {style: {
                border: '1px solid red',
            }});
            return;
        }

        if (roomRef.val().endedAt) {
            toast.error('Room already closed.', {style: {
                border: '1px solid red',
            }});
            return;
        }

        history.push(`/rooms/${roomCode}`);
    }

    return (
        <div id="page-auth" className={theme}>

            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>

            <main>
                <Switch 
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                    className='switch'
                    uncheckedIcon={false}
                    checkedIcon={false}
                    onColor="#714DDE"
                />
                <div className="main-content">
                    {theme === 'light' ? <img src={logoImg} alt="Letmeask" /> : <img src={logoDark} alt="Letmeask" /> }
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                        <Toaster position='top-left'/>
                    </form>
                </div>
            </main>

        </div>
    )
}
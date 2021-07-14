import { useState, Fragment } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import { database } from '../services/firebase'
import Modal from 'react-modal';
import Switch from "react-switch";

import logoImg from '../assets/images/logo.svg'
import logoDark from '../assets/images/logo-dark.svg'
import noQuestions from '../assets/images/no-questions-admin.svg'
import noQuestionsDark from '../assets/images/no-questions-admin-dark.svg'
import endRoom from '../assets/images/end-room-icon.svg'
import endRoomDark from '../assets/images/end-room-icon-dark.svg'
import trash from '../assets/images/trash-icon.svg'
import trashDark from '../assets/images/trash-icon-dark.svg'

import '../styles/room.scss'

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [openDeleteModal, setOpenDeleteModal] = useState<string | undefined>()
    const [endRoomModal, setEndRoomModal] = useState<boolean>(false)
    const { questions, title } = useRoom(roomId);
    const { theme, toggleTheme } = useTheme();
    
    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });
    }

    async function handleHighlightQuestion(questionId: string, isHighlighted: boolean) {
        if (isHighlighted) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isHighlighted: false,
            });
        } else {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isHighlighted: true,
            });
        }
    }

    return (
        <div id="page-room" className={theme}>

            <header>
                <div className="content">
                    {theme === 'light' ? <img src={logoImg} alt="Letmeask" /> : <img src={logoDark} alt="Letmeask" /> }
                    <div>
                        <div className='space'></div>
                        <RoomCode code={roomId} theme={theme}/>
                        <Button isOutlined onClick={() => setEndRoomModal(true)}>Encerrar sala</Button>
                        <Switch 
                          checked={theme === 'dark'}
                          onChange={toggleTheme}
                          className='switch'
                          uncheckedIcon={false}
                          checkedIcon={false}
                          onColor="#714DDE"
                        />
                    </div>
                </div>
                <Modal
                  isOpen={endRoomModal === true}
                  onRequestClose={() => setEndRoomModal(false)}
                  className={`modal-content ${theme}`}
                  overlayClassName="modal-overlay"
                  bodyOpenClassName={null}
                >
                    { theme === 'light' ? <img src={endRoom} alt="End room icon" /> : <img src={endRoomDark} alt="End room icon" /> }
                    <h1>Encerrar sala</h1>
                    <p>Tem certeza que você deseja encerrar esta sala?</p>
                    <div>
                      <Button onClick={() => setEndRoomModal(false)}>Cancelar</Button>
                      <Button onClick={handleEndRoom}>Sim, encerrar</Button>
                    </div>
                </Modal>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>
                { questions.length < 1 && (
                    <div className='empty-questions'>
                        {theme === 'light' ? <img src={noQuestions} alt="Sem perguntas" /> :  <img src={noQuestionsDark} alt="Sem perguntas" /> }
                    </div>
                ) }

                <div className="question-list">
                    {questions.map(question => {
                        return (
                          <Fragment key={question.id}>
                            <Question 
                              content={question.content} 
                              author={question.author}
                              isAnswered={question.isAnswered}
                              isHighlighted={question.isHighlighted}
                              theme={theme}
                            >
                              {!question.isAnswered && (
                                  <>
                                      <button
                                        type="button"
                                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        className="check-button"
                                      >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                                        className="answer-button"
                                      >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                      </button>
                                  </>
                              )}
                              <button
                                type="button"
                                onClick={() => setOpenDeleteModal(question.id)}
                                className="delete-button"
                              >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3 5.99988H5H21" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                  <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                              </button>
                            </Question>
                            <Modal
                              isOpen={openDeleteModal === question.id}
                              onRequestClose={() => setOpenDeleteModal(undefined)}
                              className={`modal-content ${theme}`}
                              overlayClassName="modal-overlay"
                              bodyOpenClassName={null}
                            >
                              { theme === 'light' ? <img src={trash} alt="Delete icon" /> : <img src={trashDark} alt="Delete icon" /> }
                              <h1>Excluir pergunta</h1>
                              <p>Tem certeza que você deseja excluir esta pergunta?</p>
                              <div>
                                <Button onClick={() => setOpenDeleteModal(undefined)}>Cancelar</Button>
                                <Button onClick={() => handleDeleteQuestion(question.id)}>Sim, excluir</Button>
                              </div>
                            </Modal>
                          </Fragment>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
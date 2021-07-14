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
import deleteImg from '../assets/images/delete.svg'
import deleteDark from '../assets/images/delete-dark.svg'
import checkImg from '../assets/images/check.svg'
import checkDark from '../assets/images/check-dark.svg'
import answerImg from '../assets/images/answer.svg'
import answerDark from '../assets/images/answer-dark.svg'
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
                                      >
                                        { theme === 'light' ? <img src={checkImg} alt="Marcar pergunta como respondida" /> : <img src={checkDark} alt="Marcar pergunta como respondida" /> }
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                                      >
                                          { theme === 'light' ? <img src={answerImg} alt="Dar destaque à pergunta" /> : <img src={answerDark} alt="Dar destaque à pergunta" /> }
                                      </button>
                                  </>
                              )}
                              <button
                                type="button"
                                onClick={() => setOpenDeleteModal(question.id)}
                              >
                                  { theme === 'light' ? <img src={deleteImg} alt="Remover pergunta" /> : <img src={deleteDark} alt="Remover pergunta" /> } 
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
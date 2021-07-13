import { useState, Fragment, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import { database } from '../services/firebase'
import Modal from 'react-modal';

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import noQuestions from '../assets/images/no-questions.svg'
import endRoom from '../assets/images/end-room-icon.svg'
import trash from '../assets/images/trash-icon.svg'

import '../styles/room.scss'

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    // const { user } = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const [openDeleteModal, setOpenDeleteModal] = useState<string | undefined>()
    const [endRoomModal, setEndRoomModal] = useState<boolean>(false)
    const { questions, title } = useRoom(roomId);

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
        <div id="page-room">

            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined onClick={() => setEndRoomModal(true)}>Encerrar sala</Button>
                    </div>
                </div>
                <Modal
                  isOpen={endRoomModal === true}
                  onRequestClose={() => setEndRoomModal(false)}
                  className="modal-content"
                  overlayClassName="modal-overlay"
                >
                    <img src={endRoom} alt="End room icon" />
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
                        <img src={noQuestions} alt="Sem perguntas" />
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
                            >
                              {!question.isAnswered && (
                                  <>
                                      <button
                                        type="button"
                                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                      >
                                          <img src={checkImg} alt="Marcar pergunta como respondida" />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                                      >
                                          <img src={answerImg} alt="Dar destaque à pergunta" />
                                      </button>
                                  </>
                              )}
                              <button
                                type="button"
                                onClick={() => setOpenDeleteModal(question.id)}
                              >
                                  <img src={deleteImg} alt="Remover pergunta" />
                              </button>
                            </Question>
                            <Modal
                              isOpen={openDeleteModal === question.id}
                              onRequestClose={() => setOpenDeleteModal(undefined)}
                              className="modal-content"
                              overlayClassName="modal-overlay"
                            >
                              <img src={trash} alt="Delete icon" />
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
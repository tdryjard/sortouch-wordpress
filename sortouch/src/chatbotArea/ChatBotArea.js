import React, { useState, useEffect } from 'react'
import Questionchat from '../questionBlock/QuestionChat';
import cross from './cross.png'
import logo from './logo.png'
import reload from './reload.png'
import { useForm } from "react-hook-form";
import './FormContact.css'
import './ChatBotArea.css'

const ChatBotArea = ({ modelId, userId }) => {
    const [containers, setContainers] = useState([])
    const [cardsQuest, setCardsQuest] = useState([])
    const [cardsRes, setCardsRes] = useState([])
    const [cardsCategory, setCardsCategory] = useState([])
    const [responseSelect, setResponseSelect] = useState(0)
    const [storageContainers, setStorageContainers] = useState()
    const [responseSelected, setResponseSelected] = useState([])
    const [pair, setPair] = useState(false)
    const [cardsQuestFilter, setCardsQuestFilter] = useState([])
    const [chatActive, setChatActive] = useState(false)
    const [textIcon, setTextIcon] = useState(true)
    const [posted, setPosted] = useState(false)
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")

    const { send, handleSubmit } = useForm()

    function validateEmail(email) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    const validatePhone = (phone) => {
        let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
        return re.test(phone)
    }

    const takePhone = (event) => {
        setPhone(event.target.value)
    }

    const takeEmail = (event) => {
        setEmail(event.target.value)
    }

    const sendMail = async (categoryId) => {
        if (!validateEmail(email)) {
            alert('email non valide')
        } else if (!validatePhone(phone)) {
            alert('numéro de téléphone non valide')
        } else {
            const result = await fetch('http://192.168.43.193:8000/api/mail/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Acces-Control-Allow-Origin': { origin }
                },
                body: JSON.stringify({
                    phone: phone,
                    email: email,
                    message: message,
                    category_id: categoryId,
                    model_id: modelId,
                    user_id: userId,
                    view: 0
                })
            });
            if (result) {
                setPosted(true)
                setTimeout(() => {
                    reloadFunction(true)
                }, 4000)
            }
        }
    }

    const getMessage = (e) => {
        setMessage(e.target.value)
    }

    useEffect(() => {
        printContainers()
    }, [userId, responseSelected])

    useEffect(() => {
        setTimeout(() => {
            setTextIcon(false)
        }, 6000)
    }, [])


    const printContainers = async () => {
        try {
            fetch(`http://192.168.43.193:8000/api/container/findAll/${userId}/${responseSelect}/${modelId}`)
                .then(res => res.json())
                .then(res => {
                    if (res.length) {
                        if (storageContainers) {
                            let resResult = res.filter(res => res.response_id != null)
                            let newContainer = [...storageContainers, ...resResult]
                            setContainers(newContainer)
                            takeCard(newContainer)
                        } else {
                            setContainers(res)
                            takeCard(res)
                        }
                    }
                })


        } catch (error) {
            console.log(error)
        }
        setStorageContainers(containers)
    }

    const takeCard = async (res) => {
        let stock = []
        for (let i = 0; i < res.length + 3; i++) {
            if (res[i]) {
                let resulted = await fetch(`http://192.168.43.193:8000/api/relation/findCardQuestion/${res[i].id}/${userId}/${modelId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const result = await resulted.json()
                stock = [...stock, result]
            }
        }
        if (stock.length) {

            setCardsQuest(stock)
            const stockFilter = await stock.filter(quest => quest[0])
            setCardsQuestFilter(stockFilter)

        }


        let stockRes = []
        for (let i = 0; i < res.length + 3; i++) {
            if (res[i]) {
                let resulted = await fetch(`http://192.168.43.193:8000/api/relation/findCardResponse/${res[i].id}/${userId}/${modelId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const result = await resulted.json()
                stockRes = [...stockRes, result]
            }
        }
        setCardsRes(stockRes)
        let stockCategory = []
        for (let i = 0; i < res.length + 3; i++) {
            if (typeof res[i] === 'object') {
                let resulted = await fetch(`http://192.168.43.193:8000/api/relation/findCardCategory/${res[i].id}/${userId}/${modelId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const result = await resulted.json()
                stockCategory = [...stockCategory, result]
            }
        }
        setCardsCategory(stockCategory)
    }

    const selectResponse = async function (cardId, index) {
        setPair(!pair)
        const stockContainers = containers
        const numberCard = cardId
        const containerIndex = index + 1
        setResponseSelect(numberCard)



        responseSelected.length = cardId
        stockContainers.length = containerIndex


        let stockResponseSelected = ([...responseSelected, numberCard])

        for (let a = 0; a < cardsRes.length; a++) {
            if (cardsRes[a].length) {
                for (let b = 0; b < cardsRes[a].length; b++) {
                    for (let c = 0; c < stockResponseSelected.length; c++) {
                        const nbRes = cardsRes[a].filter(card => stockResponseSelected.includes(card.id))
                        if (nbRes.length > 1) {
                            for (let i = 0; i < stockResponseSelected.length; i++) {
                                for (let a = 0; a < nbRes.length - 1; a++) {
                                    if (nbRes[a].id === (stockResponseSelected[i])) {
                                        stockResponseSelected.splice(i, 1)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        setResponseSelected(stockResponseSelected)

        setStorageContainers(stockContainers)

        if (stockContainers) {
            printContainers()
        }
    }


    const activeChat = () => {
        setChatActive(true)
    }

    const reloadFunction = (isPost) => {
        setContainers([])
        setCardsQuest([])
        setCardsRes([])
        setCardsCategory([])
        setResponseSelect(0)
        setStorageContainers()
        setResponseSelected([])
        setCardsQuestFilter([])
        if (isPost === true) setPosted(false)
    }




    return (
        <div className={!chatActive ? "containerIconChat" : "containerChatbot"}>
            {chatActive &&
                <div className="headChatbot">
                    <img onClick={() => { setChatActive(!chatActive) }} alt="close sortouch" src={cross} className="crossChatbot" />
                    <img onClick={reloadFunction} alt="reload sortouch" src={reload} className="reloadChatbot" />
                    <a target="__blank" href="https://sortouch.com" className="sortouch">Sortouch</a>
                </div>}
            <div className={chatActive ? "contentChatbot" : "contentIcon"}>
                {!chatActive ?
                    <div className="contentIcon">
                        {textIcon &&
                            <div className="contentTextIconChat">
                                <p onClick={activeChat} className="textIconCard"><Questionchat text={"Prenez contact avec moi !"} /></p>
                            </div>}
                        <img alt="icon chat" onClick={activeChat} src={logo} className="iconChat" />
                    </div>
                    : chatActive && posted === false &&
                    Array.isArray(containers) &&
                    containers.map((container, index) => {
                        return (
                            <div className={container.content_type === "question" ? "contentLittleQuestChat" : container.content_type === "response" ? "contentResponseChat" : "contentLittleDestinationChat"}>
                                {Array.isArray(cardsQuest[index]) && container.content_type === "question" &&
                                    cardsQuest[index].map(card => {
                                        return (
                                            cardsQuestFilter[cardsQuestFilter.length - 1] && card.id === cardsQuestFilter[cardsQuestFilter.length - 1][0].id ?
                                                <div className="contentQuestChat">
                                                    <Questionchat text={card.content} />
                                                    <img alt="sortouch" src={logo} className="logoChat" />
                                                </div>
                                                :
                                                <div className="contentQuestChat">
                                                    <p className="textQuest">{card.content}</p>
                                                    <img alt="sortouch" src={logo} className="logoChat" />
                                                </div>
                                        )
                                    })}
                                {Array.isArray(cardsRes[index]) && container.content_type === "response" &&
                                    cardsRes[index].map(card => {
                                        return (
                                            <div onClick={() => { selectResponse(card.id, index) }} className={responseSelected.includes(card.id) ? 'containerLittleCardResChatActive' : 'containerLittleCardResChat'}>
                                                <p id={`container${index}`} className="textCardResChat">{card.content}</p>
                                            </div>)
                                    })
                                }
                                {Array.isArray(cardsCategory[index]) && container.content_type === "category" &&
                                    cardsCategory[index].map(card => {
                                        return (
                                            <form onSubmit={handleSubmit(() => {sendMail(card.id)})} className="containerLittleFormChatbot">
                                                <input ref={send} onChange={takeEmail} type="text" className="inputFormChat" placeholder="email" />
                                                <input ref={send} onChange={takePhone} type="text" className="inputFormChat" placeholder="numéro de téléphone" />
                                                <textarea ref={send} className="inputMessageFormChatbot" placeholder="message" onChange={getMessage} />
                                                <button type="submit" className="sendFormChatbot">Envoyer !</button>
                                            </form>
                                        )
                                    })}
                            </div>
                        )
                    })}
                {posted &&
                        <div className="containerTextePosted">
                            <p className="textPosted">Merci !</p>
                        </div>}
            </div>
        </div>
    )
}

export default ChatBotArea
// import React, { useEffect, useRef } from 'react'

// const Log = ({ history }) => {

//   const messagesEndRef = useRef(null)

//   const scrollToBottom = () => {
//     messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
//   }

//   useEffect(scrollToBottom, [history]);

//   return (
    
//     <div>
//       {history.map(message => <Message key={message.id} {...message} />)}
//       <div ref={messagesEndRef} />
//     </div>
//   )
// }


// <ol className='History-table' ref={scrollRef}>
// {
//   history.map((e) => {
//     return (<li className='History-item'>
//         {e}
//     </li>
//     )
//   })
// }
// </ol>
import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios'

import DatePickerCustom from './DatePicker'
// import '../App.css';
import '../Modal.css'

const customStyles = {
  content: {
    top: '0%',
    left: '0%',
    right: '0%',
    bottom: '0%',
    backgroundColor: "rgba(40, 44, 52, 0.75)",
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
export default function StartPageModal() {
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(true);
  const [startDate, setStartDate] = useState(new Date());

  function openModal() {
    setIsOpen(true);
  }

  // function afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   subtitle.style.color = '#f00';
  // }

  async function closeModal() {
    await axios.post('/start', {
      today: startDate
    })
    setIsOpen(false);
  }

  // useEffect(() => {


  // }, [startDate])

  return (
    <div >
      {/* <button onClick={openModal}>Open Modal</button> */}
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        // contentLabel="Example Modal"
        // className='Modal-main'
      >
        <div className='Modal-Main'>
          <p>
            오늘 날짜를 선택하신 후, 시작 버튼을 눌러주세요
          </p>
          <div>
            날짜 선택: <DatePickerCustom startDate={startDate} setStartDate={setStartDate}/>
          
          </div>

          {/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
          <button onClick={closeModal}>시작하기 </button>
        </div>
      </Modal>
    </div>
  );
}
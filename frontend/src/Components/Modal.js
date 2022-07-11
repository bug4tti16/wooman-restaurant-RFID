import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios'

import DatePickerCustom from './DatePicker'
import NoticePageModal from './NoticeModal'

// import '../App.css';
import '../Modal.css'
import { addISOWeekYears } from 'date-fns';

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
export default function StartPageModal(props) {
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  // const [preHistory, setPreHistory] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  // function afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   subtitle.style.color = '#f00';
  // }

  async function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    async function getCache() {
      const {data: {
        result, cache
      }} = await axios.get("/prestart")
      console.log(result, cache)
      if (result) {
        // setPreHistory(true)
        if (window.confirm("이전 기록이 있습니다. 불러오시겠습니까?")) {

          props.setHistory(cache);
          closeModal()
        }
        else {
          function onClose() {
            window.open("about:blank", "_self").close();
          }
          const kill = async (e) => {
            // e.preventDefault();
            alert("서버를 종료합니다. 다시 시작해주세요.")
            try {
              await axios({
                method: 'get',
                url: '/kill',
                timeout: 100
              })
            } finally {
              onClose()
            }
          }
          kill()
        }
      }
    }
    getCache()
    // window.confirm("")


  }, [])

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
          <h2 style={{paddingTop: "10px"}}>
            오늘 날짜를 선택하신 후, 시작 버튼을 눌러주세요
          </h2>
          <div>
            <h4>
              날짜 선택:
              <DatePickerCustom
              startDate={startDate}
              setStartDate={setStartDate}
              /> 
            </h4>
          </div>

          <NoticePageModal
            modalIsOpen={modalIsOpen}
            setIsOpen={setIsOpen}
            startDate={startDate}
          />
        </div>
      </Modal>

      
    </div>
  );
}
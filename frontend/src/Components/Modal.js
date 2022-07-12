import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios'

import DatePickerCustom from './DatePicker'
import NoticePageModal from './NoticeModal'
import Kill from '../Api/Kill'

// import '../App.css';
import '../Modal.css'

import errorCode from '../errorCode.json'

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
  const [modalIsOpen, setIsOpen] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  // const [preHistory, setPreHistory] = useState(false);

  // function openModal() {
  //   setIsOpen(true);
  // }

  async function closeModal() {
    setIsOpen(false);
  }

  async function resetChart() {

    const {data: {result, file, error} } = await axios.post('/user/reset')
    console.log(result, file)
    if (result) {
      alert(
        `정상적으로 'user_list.csv'파일이 초기화 되었으며,\ndata/${file} 파일에 백업되었습니다.\n
        `
      )
    }
    else {
      if (error === 0) {
        alert("이미 초기화된 상태입니다.")
      }
      else if (error === 4 || error === 5) {
        alert(errorCode[error])
      }
      
    }
    alert("확인을 누르면 프로그램이 종료됩니다.\n빈 창이 뜨는 경우, 창을 직접 닫아주십시오.")
    Kill()
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
          
          let newUserCnt = new Set()
          for (const item of cache) {
            if (item.type === 0) {
              newUserCnt.add(item.id)
            }
            else if (item.type === 2) {
              newUserCnt = new Set([...newUserCnt].filter(x => x !== item.id))
            }
          }
          props.setUsercnt(newUserCnt)
          closeModal()
        }
        else {
          alert("서버를 종료합니다. 다시 시작해주세요.")
          Kill()
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
        ariaHideApp={false}
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

            <h4  style={{marginTop: "0px", marginBottom: "5px"}}> 유저 명단 초기화:</h4>
              <h5 style={{marginTop: "0px", marginBottom: "5px"}}>('user_list_new.csv'을'user_list.csv'에 덮어씁니다.)</h5>
              <h5 style={{marginTop: "0px",  marginBottom: "0px"}}>(명단이 변경된 경우, 초기화 버튼을 눌러주십시오.)</h5>
              <button
                onClick={resetChart}
                style={{
                  width: "100px",
                  height: "30px",
                  marginBottom: "40px"
                }}
              >초기화</button>
            
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
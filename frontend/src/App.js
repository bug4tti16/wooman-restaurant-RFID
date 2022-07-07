import logo from './logo.svg';

import './App.css';

import { useEffect, useState, useRef } from 'react';
import Autosuggest from "react-autosuggest";
import React from 'react';

import axios from 'axios'


import errorCode from './errorCode.json'
import StartPageModal from './Components/Modal'

function App() {

  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [userData, setUserdata] = useState([]);
  // const [ChartName, setChartName] = useState({});
  // const [ChartIndex, setChartIndex] = useState({});

  const [history, setHistory] = useState([]);
  const [userCnt, setUsercnt] = useState(new Set());

  // Scroll
  const scrollRef = useRef();

  // const scrollToBottom = () => {
  //   messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  // }

  // useEffect(scrollToBottom, [messages]);


  const scrollToBottom = () => {
    const {scrollHeight, clientHeight} = scrollRef.current;
    scrollRef.current.scrollTop = scrollHeight - clientHeight
  }

  useEffect(() => {
    async function fetchAPI() {
      const result = await axios.get('/user/all/list')
      // const result2 = await axios.get('/user/all/json')
      setUserdata(result.data)
      // setChartName(result2?.data?.name)
      // setChartIndex(result2?.data?.index)
    }
    fetchAPI()
  }, [])


  useEffect(()=>{
      scrollToBottom()
  },[history])

  function getSuggestions(value) {  
    return userData.filter(name => name.includes(value.trim().toLowerCase()));
  }


  const onSubmit = async (e) => {
    e.preventDefault();

    if (typeof(value) != "string" || value.length == 0) {
      return;
    }

    if (!isNaN(value)) { // 숫자로 입력한 경우
      const id = parseInt(value)
      const {data: result} = await axios.post('/user/id', {id})
      setHistory([...history, {
        name: result.name,
        id: result.id,
        result: result.result,
        error: result.error,
        type: result.result ? 0 : 1
      }]);
      if (result.result) {
        setUsercnt(new Set(userCnt.add(result.id)))
      }
    }
    else { // string 입력
      const {data: result} = await axios.post('/user/name', {name: value.replace(/ /gi, "")})
      setHistory([...history, {
        name: result.name,
        id: result.id,
        result: result.result,
        error: result.error,
        type: result.result ? 0 : 1
      }]);
      if (result.result) {
        setUsercnt(new Set(userCnt.add(result.id)))
      }
    }
    // setHistory([...history, log]);
    setValue('')
    scrollToBottom()
  };

  const save = async (e) => {
    e.preventDefault();
    await axios.post('/save')
    setHistory([...history, {
      name: '',
      id: '',
      result: '',
      error: '',
      type: 3
    }]);

  }

  const revert = async (id, name, e) => {
    e.preventDefault()
    const {data: result} = await axios.delete('/user/id', {
      data: { id }
    })
    setHistory([...history, {
      name: result.name,
      id: result.id,
      result: result.result,
      error: result.error,
      type: 2 // type 2: 취소
    }]);

    if (result.result) {
      setUsercnt(new Set([...userCnt].filter(x => x != result.id)))
    }
  }

  return (
    <div className="App">
      <div className="App-header">
        {/* <img src={'https://www.wooman.or.kr/images/comm/logo.gif'} className="App-logo" alt="logo" />
        <p>
          경로 식당 입장 입력기
        </p> */}
      <h1 style={{margin: "10px"}}>우만종합사회복지관</h1>
      <h2>경로 식당</h2>
      
      <div style={{
        width: "80%"
      }}>
        <div style={{marginTop: "10px"}}>
        경로 식당 이용자 수: {userCnt.size}명
        </div>
          <div className='History-table' ref={scrollRef}>
            {
              history.map(({
                name, id, result, error, type
              }, index) => {
                if (type == 0) {
                  return (
                  <div key={index} className='History-item History-item-success'> 
                      <span style={{}}>{id}번 {name}</span> 확인완료 <button className='History-revert-button' onClick={(e) => {revert(id, name, e)}}>취소</button>
                  </div>
                  )
                }
                else if (type == 1) {
                  return (
                  <div key={index} className='History-item History-item-fail'>
                    <span style={{}}>{id || name}</span> ({errorCode[error]})
                  </div>
                  )
                }
                else if (type == 2) {
                  return (
                    <div key={index} className='History-item History-item-revert'>
                      <span style={{}}>{id}번 {name}</span> 취소완료
                    </div>
                  )
                }
                else if (type == 3) {
                  return (
                    <div key={index} className='History-item History-item-save'>
                      저장 완료
                    </div>
                  )

                }
              })
            }
          </div>
      </div>
      <div style={{
        width: "80%",
        textAlign: "end",
        fontSize: "1rem"
      }}>
        <button onClick={save}>저장</button>
      </div>

      <h3>입력</h3>

      <form onSubmit={onSubmit} className="App-form">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsClearRequested={() => setSuggestions([])}
        onSuggestionsFetchRequested={({ value }) => {
          setValue(value);
          setSuggestions(getSuggestions(value));
        }}
        getSuggestionValue={suggestion => suggestion}
        renderSuggestion={suggestion => (<span>{suggestion}</span>)
        }
        inputProps={{

          placeholder: `카드 번호 또는 이름을 입력해주세요`, 

          // 식당 이용을 시작하겠습니다
          // 카드를 찍으시는 경우 번호 입력 바랍니다
          // 카드를 가져오시지 않은 경우 이름을 입력하거나 번호에 0을 붙쳐 입력바랍니다
          // 작업을 취소하고 싶으면 번호에 -를 붙쳐 입력바랍니다
          // 정보를 저장할 경우 저장 이라고 입력바랍니다
          // 식당 운영을 마무리할 경우 끝 이라고 입력바랍니다
          value: value,
          onChange: (_, { newValue, method }) => {
            setValue(newValue);
          }
        }}
        highlightFirstSuggestion={true}
      />
      </form>

      <StartPageModal />


      

      </div>      
    </div>
  );
}

export default App;

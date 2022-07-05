import logo from './logo.svg';

import './App.css';

import { useEffect, useState, useRef } from 'react';
import Autosuggest from "react-autosuggest";
import axios from 'axios'

// const companies = [
//   { id: 1, name: "Company1" },
//   { id: 2, name: "Company2" },
//   { id: 3, name: "Company3" },
//   { id: 4, name: "Company4" },
//   { id: 5, name: "Company5" },
//   { id: 6, name: "Company6" },
//   { id: 7, name: "Company7" }
// ];

// const lowerCasedCompanies = companies.map(company => {
//   return {
//     id: company.id,
//     name: company.name.toLowerCase()
//   };
// });


// const getSuggestions = value => {
//   const inputValue = value.trim().toLowerCase();
//   const inputLength = inputValue.length;

//   return inputLength === 0 ? [] : languages.filter(lang =>
//     lang.name.toLowerCase().slice(0, inputLength) === inputValue
//   );
// };


// const getSuggestionValue = suggestion => suggestion.name;

// // Use your imagination to render suggestions.
// const renderSuggestion = suggestion => (
//   <div>
//     {suggestion.name}
//   </div>
// );
function App() {

  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [userData, setUserdata] = useState([]);
  // const [ChartName, setChartName] = useState({});
  // const [ChartIndex, setChartIndex] = useState({});

  const [history, setHistory] = useState([]);

  

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
      const index = parseInt(value)
      const {data: result} = await axios.post('/user/id', {index})
      setHistory([...history, {
        name: result.name,
        id: result.index,
        result: result.result,
        error: result.error
      }]);
    }
    else { // string 입력
      const {data: result} = await axios.post('/user/name', {name: value.replace(/ /gi, "")})
      setHistory([...history, {
        name: result.name,
        id: result.index,
        result: result.result,
        error: result.error
      }]);
    }
    // setHistory([...history, log]);
    setValue('')
    scrollToBottom()
  };


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
        경로 식당 이용자 수: {history.length}명
        </div>
          <div className='History-table' ref={scrollRef}>
            {
              history.map(({
                name, id, result, error
              }, index) => {
                if (result) {
                  return (
                  <div key={index} className='History-item-success'> 
                      {id}번 {name} 확인완료
                  </div>
                  )
                }
                else {
                  return (
                  <div key={index} className='History-item-fail'>
                    {id || name} (사유: {error})
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
        <span>저장</span>
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
          placeholder: "입력해주세요", 
          value: value,
          onChange: (_, { newValue, method }) => {
            setValue(newValue);
          }
        }}
        highlightFirstSuggestion={true}
      />
      </form>
      </div>      
    </div>
  );
}

export default App;

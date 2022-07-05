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
  const [history, setHistory] = useState([]);

  

  // Scrol

  const scrollRef = useRef();

  // const scrollToBottom = () => {
  //   messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  // }

  // useEffect(scrollToBottom, [messages]);


  const scrollToBottom = () => {
    const {scrollHeight, clientHeight} = scrollRef.current;
    scrollRef.current.scrollTop = scrollHeight - clientHeight
  }



  console.log(history, typeof(history))

  useEffect(() => {
    async function fetchAPI() {
      const result = await axios.get('/user/all/list')
      setUserdata(result.data)

    }
    fetchAPI()
  }, [])


  useEffect(()=>{
      scrollToBottom()
  },[history])

  function getSuggestions(value) {  
    return userData.filter(name => name.includes(value.trim().toLowerCase()));
  }

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(value);
    console.log(history, typeof(history))
    setHistory([...history, value]);
    setValue('')
    scrollToBottom()
  };

  // console.log(getSuggestions('김'))

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
        <h3>로그</h3>
        <div>
        경로 식당 이용자 수: {history.length}명
        </div>
          <div className='History-table' ref={scrollRef}>
            {
              history.map((e) => {
                return (<div className='History-item'>{e}</div>
                )
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
        onSuggestionSelected={(_, { suggestionValue }) =>
          console.log("Selected: " + suggestionValue)
        }
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

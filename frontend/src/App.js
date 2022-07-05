import logo from './logo.svg';

import './App.css';

import { useEffect, useState } from 'react';
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
  console.log(history, typeof(history))

  useEffect(() => {
    async function fetchAPI() {
      const result = await axios.get('/user/all')
      setUserdata(result.data)

    }
    fetchAPI()
  }, [])

  function getSuggestions(value) {  
    return userData.filter(name => name.includes(value.trim().toLowerCase()));
  }

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(value);
    console.log(history, typeof(history))
    setHistory([...history, value]);
    setValue('')
  };

  // console.log(getSuggestions('김'))

  return (
    <div className="App">
      <div className="App-header">
        {/* <img src={'https://www.wooman.or.kr/images/comm/logo.gif'} className="App-logo" alt="logo" />
        <p>
          경로 식당 입장 입력기
        </p> */}

      <h1>경로 식당</h1>
      <div>
        <h2>기록</h2>
        <div>
          <table className='History-table'>
            {
              history.map((e) => {
                return (<tr>
                  <td>
                    {e}
                  </td>
                </tr>
                )
              })
            }
          </table>
        </div>
      </div>
{/* 
      <h2>입력</h2> */}

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

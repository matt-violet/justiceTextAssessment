import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import AOS from 'aos';
import 'aos/dist/aos.css';
import TextItem from './TextItem'
import './App.css';

// app will fetch paragraphs in groups of 10, starting with the first 10 paragraphs
let DATA_SET = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// const DATA_SIZE_HALF = "half"
// const DATA_SIZE_FULL = "full"
const INTERVAL_TIME = 2000

/** Application entry point */
function App() {

  const [data, setData] = useState([])
  const [value, setValue] = useState(0)
  const [searchInput, setSearchInput] = useState("")
  const [hasMore, setHasMore] = useState(true);

  // initialize Animate On Scroll Library
  AOS.init()

  /** DO NOT CHANGE THE FUNCTION BELOW */
  useEffect(() => {
    setInterval(() => {
      // Find random bucket of words to highlight
      setValue(Math.floor(Math.random() * 10))
    }, INTERVAL_TIME)
  }, [])
  /** DO NOT CHANGE THE FUNCTION ABOVE */

  useEffect(() => {
    const fetchData = async () => {
      let dataItems = await Promise.all (DATA_SET.map(async id => {
        return (await fetch("/api/dataItem/" + id)).json()
      }))
      setData(dataItems)
    }
    
    fetchData()
  }, [])

  const handleChange = e => {
    setSearchInput(e.target.value)
  }

  const getMoreData = async () => {
    // exit function if all 90 paragraphs have already been fetched
    if (data.length === 90) {
      setHasMore(false);
      return;
    }

    // use setTimeout to avoid overloading the server with requests
    setTimeout(async () => {
      const lastDataIndex = data.length - 1
      let NEXT_DATA_SET = [];
      
      // using the last index of the current data set, determine next 10 paragraphs to fetch
      for (let i = 1; i < 11; i++) {
        NEXT_DATA_SET.push(lastDataIndex + i)
      }
      
      // fetch next group of paragraphs
      let dataItems = await Promise.all (NEXT_DATA_SET.map(async id => {
        return (await fetch("/api/dataItem/" + id)).json()
      }))
      
      // create copy of current data set, append new data, and update state
      const newData = [...data];
      dataItems.forEach((item) => {
        newData.push(item)
      }) 
      setData(newData)
    }, 200)
  }

  return (
    <div className="App">
      <div className="header">
        <div data-aos="fade-down">
          <h2 data-aos="fade-in">JT Online Book</h2>
          <div>
            <input type="text" placeholder="Search text" value={searchInput} onChange={handleChange}/>
          </div>
        </div>
      </div>
      <div className="content" data-aos="fade-up">
        <InfiniteScroll
          dataLength={data.length}
          next={getMoreData}
          hasMore={hasMore}
          loader={<h4 data-aos="fade-in">Loading...</h4>}
          endMessage={
            <p style={{textAlign: 'center'}}>
              <b>~End~</b>
            </p>
          }
        >
          {data.map((row, i) => {
            return (
              <p key={`p${i}`}>
                {row.map((textitem, j) => {
                  if (searchInput.length > 0 && textitem.text.search(searchInput) === -1) {
                    return null;
                  }
                  
                  return (
                    <TextItem key={`${i}${j}`} value={value} data={textitem}/>
                  )
                })}
              </p>
            )
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default App;
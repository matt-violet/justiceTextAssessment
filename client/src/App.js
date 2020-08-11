import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import TextItem from './TextItem'
import './App.css';

let DATA_SET = [0, 1, 2]

// const DATA_SIZE_HALF = "half"
// const DATA_SIZE_FULL = "full"
const INTERVAL_TIME = 2000

/** Application entry point */
function App() {

  const [data, setData] = useState([])
  const [value, setValue] = useState(0)
  const [searchInput, setSearchInput] = useState("")
  const [hasMore, setHasMore] = useState(true);

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
    if (data.length === 90) {
      setHasMore(false);
      return;
    }
  
    let NEXT_DATA_SET = [];
    const lastDataIndex = data.length - 1

    for (let i = 1; i < 4; i++) {
      NEXT_DATA_SET.push(lastDataIndex + i)
    }

    let dataItems = await Promise.all (NEXT_DATA_SET.map(async id => {
      return (await fetch("/api/dataItem/" + id)).json()
    }))

    let newData = [...data];
    for (const item of dataItems) {
      newData.push(item)
    }
    setData(newData)
  }

  return (
    <div className="App">
      <div className="header">
        <h2>JT Online Book</h2>
        <div>
          <input type="text" placeholder="Search text" value={searchInput} onChange={handleChange}/>
        </div>
      </div>
      <div className="content">
        <InfiniteScroll
          dataLength={data.length}
          next={getMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
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
import SearchContext from '../../SearchContext'
import Header from '../Header'
import SearchPosts from '../SearchPosts'
import Stories from '../Stories'
import Posts from '../Posts'

import './index.css'

const Home = () => (
  <SearchContext.Consumer>
    {value => {
      const {searchInput, isDark, searchPostView} = value

      return (
        <>
          <Header />

          <div className="app-container">
            {searchPostView ? (
              <SearchPosts search={searchInput} theme={isDark} />
            ) : (
              <>
                <Stories />
                <Posts />
              </>
            )}
          </div>
        </>
      )
    }}
  </SearchContext.Consumer>
)
export default Home

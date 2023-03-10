import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'

import './index.css'
import SearchContext from '../../SearchContext'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 7,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
  ],
}

const apiStatusUpdate = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Stories extends Component {
  state = {
    storiesList: [],
    apiStatus: apiStatusUpdate.initial,
  }

  componentDidMount() {
    this.getStories()
  }

  getStories = async () => {
    this.setState({apiStatus: apiStatusUpdate.inProgress})
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedStories = data.users_stories.map(each => ({
        userId: each.user_id,
        username: each.user_name,
        storyUrl: each.story_url,
      }))
      this.setState({
        storiesList: updatedStories,
        apiStatus: apiStatusUpdate.success,
      })
    } else {
      this.setState({apiStatus: apiStatusUpdate.failure})
    }
  }

  renderFailureView = () => (
    <SearchContext.Consumer>
      {value => {
        const {isDark} = value
        const failure = isDark ? 'failure-desc failure-desc2' : 'failure-desc'
        return (
          <div className="failure-view">
            <img
              className="failure-image"
              alt="failure view"
              src="https://res.cloudinary.com/dxjowybhg/image/upload/v1663949381/failure-view_id1apf.png"
            />
            <p className={failure}>Something went wrong. Please try again</p>
            <button
              className="failure-button"
              type="button"
              onClick={this.onRetry}
            >
              Try again
            </button>
          </div>
        )
      }}
    </SearchContext.Consumer>
  )

  renderLoadingView = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div className="loader" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  onRetry = () => {
    this.setState({apiStatus: apiStatusUpdate.inProgress}, this.getStories)
  }

  renderStoriesView = () => {
    const {storiesList} = this.state
    return (
      <SearchContext.Consumer>
        {value => {
          const {isDark} = value
          const storyName = isDark ? 'story-name story-name2' : 'story-name'

          return (
            <div className="stories-list-containers">
              <div className="slick-container">
                <Slider {...settings}>
                  {storiesList.map(eachStory => {
                    const {userId, username, storyUrl} = eachStory

                    return (
                      <div className="slick-item" key={userId}>
                        <div className="circles">
                          <img
                            className="story-images"
                            alt="user story"
                            src={storyUrl}
                          />
                        </div>
                        <p className={storyName}>{username}</p>
                      </div>
                    )
                  })}
                </Slider>
              </div>
            </div>
          )
        }}
      </SearchContext.Consumer>
    )
  }

  renderApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusUpdate.success:
        return this.renderStoriesView()
      case apiStatusUpdate.failure:
        return this.renderFailureView()
      case apiStatusUpdate.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return this.renderApiStatus()
  }
}
export default Stories

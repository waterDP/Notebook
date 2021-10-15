function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  )
}

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  )
}


// 具名
function SplitPanel(props) {
  return (
    <div className="SplitPanel">
      <div className="SplitPanel-left">
        {props.left}
      </div>
      <div className="SplitPanel-right">
        {props.right}
      </div>
    </div>
  )
}

function App() {
  return (
    <SplitPanel 
      left={<Contacts />}
      right={<Chart />}
    />
  )
}

// todo 特例关系
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1> 
      <p className="Dialog-title">
        {props.message}
      </p>
    </FancyBorder>
  )
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Tank you for visiting our spacecraft"
    />
  )
}

// todo cloneElement
function FatherComponent({children}) {
  const newChildren = React.cloneElement(children)
  return <div>{newChildren}</div>
}

function SonComponent(props) {
  return <div>hello word</div>
}

class Index extends React.Component {
  render() {
    return (
      <div className="box">
        <FatherComponent>
          <SonComponent name="alien" />
        </FatherComponent>
      </div>
    )
  }
}
const head = document.querySelector('head')
const body = document.querySelector('body')

// mocha CSS link
const mochaCSSPath = "https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.2/mocha.min.css"
const mochaCSSLinkEl = document.createElement('link')
mochaCSSLinkEl.rel = 'stylesheet'
mochaCSSLinkEl.href = mochaCSSPath
head.prepend(mochaCSSLinkEl)

// custom styles for mocha runner
const mochaStyleEl = document.createElement('style')
mochaStyleEl.innerHTML =
  `#mocha {
    font-family: sans-serif;
    position: fixed;
    overflow-y: auto;
    z-index: 1000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 48px 0 96px;
    background: white;
    color: black;
    display: none;
    margin: 0;
  }
  #mocha * {
    letter-spacing: normal;
    text-align: left;
  }
  #mocha .replay {
    pointer-events: none;
  }
  #mocha-test-btn {
    position: fixed;
    bottom: 50px;
    right: 50px;
    z-index: 1001;
    background-color: #007147;
    border: #009960 2px solid;
    color: white;
    font-size: initial;
    border-radius: 4px;
    padding: 12px 24px;
    transition: 200ms;
    cursor: pointer;
  }
  #mocha-test-btn:hover:not(:disabled) {
    background-color: #009960;
  }
  #mocha-test-btn:disabled {
    background-color: grey;
    border-color: grey;
    cursor: initial;
    opacity: 0.7;
  }`
head.appendChild(mochaStyleEl)

// mocha div
const mochaDiv = document.createElement('div')
mochaDiv.id = 'mocha'
body.appendChild(mochaDiv)

// run tests button
const testBtn = document.createElement('button')
testBtn.textContent = "Loading Tests"
testBtn.id = 'mocha-test-btn'
testBtn.disabled = true
body.appendChild(testBtn)

const scriptPaths = [
  "https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.2/mocha.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/chai/4.3.4/chai.min.js",
  // "https://cdnjs.cloudflare.com/ajax/libs/sinon.js/10.0.1/sinon.min.js",
  // "jsdom.js" // npx browserify _jsdom.js --standalone JSDOM -o jsdom.js
]
const scriptTags = scriptPaths.map(path => {
  const scriptTag = document.createElement('script')
  scriptTag.type = 'text/javascript'
  scriptTag.src = path
  return scriptTag
})

let loaded = 0
if (localStorage.getItem('test-run')) {
  // lazy load test dependencies
  scriptTags.forEach(tag => {
    body.appendChild(tag)
    tag.onload = function () {
      if (loaded !== scriptTags.length - 1) {
        loaded++
        return
      }
      testBtn.textContent = 'Run Tests'
      testBtn.disabled = false
      testBtn.onclick = __handleClick
      runTests()
    }
  })
} else {
  testBtn.textContent = 'Run Tests'
  testBtn.disabled = false
  testBtn.onclick = __handleClick
}

function __handleClick() {
  if (!localStorage.getItem('test-run') && this.textContent === 'Run Tests') {
    localStorage.setItem('test-run', true)
  } else {
    localStorage.removeItem('test-run')
  }
  window.location.reload()
}

function runTests() {
  testBtn.textContent = 'Running Tests'
  testBtn.disabled = true

  mochaDiv.style.display = 'block'
  body.style.overflow = 'hidden'

  mocha.setup("bdd");
  const expect = chai.expect;

  String.prototype.includesLetters = function (letters) {
    return letters.split("").every((letter) => this.includes(letter))
  }

  describe("Todo App", function () {
    const button = document.querySelector('form button')
    const input = document.querySelector('form input')
    const list = document.getElementById('todo-list')
    document.querySelector('form').addEventListener('submit', function(e) {
      e.preventDefault()
    })
    afterEach(() => {
      list.innerHTML = ""
      input.value = ""
    })
    after(() => {
      testBtn.disabled = false
      testBtn.textContent = 'Close Tests'
    })
    it('should not add a todo when clicking button without typing value', () => {
      input.value = ""
      button.click()
      expect(list.innerHTML).to.eq("")
    })
    it('should not add a todo when clicking button if input is filled with only spaces', () => {
      input.value = "    "
      button.click()
      expect(list.innerHTML).to.eq("")
    })
    it('should generate list item element when adding todo', () => {
      input.value = "banana"
      button.click()
      expect(list.querySelector('li')).to.exist
    })
    it('should generate button element within list item element when adding todo', () => {
      input.value = "banana"
      button.click()
      expect(list.querySelector('li > button')).to.exist
    })
    it('should generate button element containing text of todo when adding todo', () => {
      input.value = "banana"
      button.click()
      expect(list.querySelector('li > button').textContent).to.eq('banana')
    })
    it('should set value of input element to empty string after adding todo', () => {
      input.value = "banana"
      button.click()
      expect(input.value).to.eq("")
    })
    it('should mark todo as done by striking through text when todo is clicked ONCE', () => {
      input.value = "banana"
      button.click()
      const todo = list.querySelector('li button')
      expect(todo).to.exist
      expect(todo.textContent).to.eq('banana')
      expect(getComputedStyle(todo).textDecoration).to.not.include('line-through')
      todo.click()
      expect(getComputedStyle(todo).textDecoration).to.include('line-through')
    })
    it('should remove todo from list when clicking todo TWICE', () => {
      input.value = "banana"
      button.click()
      const todo = list.querySelector('li button')
      expect(todo).to.exist
      expect(todo.textContent).to.eq('banana')
      expect(getComputedStyle(todo).textDecoration).to.not.include('line-through')
      todo.click()
      todo.click()
      expect(list.querySelector('li button')).to.not.exist
    })
    it('should add multiple todos', () => {
      const todos = [
        'banana',
        'grape',
        'mango',
        'apple'
      ]

      todos.forEach((todo, index) => {
        input.value = todo
        button.click()
        const todos = Array.from(list.querySelectorAll('li button'))
        expect(todos.length === index + 1).to.be.true
        const lastTodo = todos.find(todoEl => todoEl.textContent === todo)
        expect(lastTodo).to.exist
        expect(lastTodo.textContent).to.eq(todo)
      })
    })
    it('should be able to remove todos from middle of the list', () => {
      let todos = [
        'banana',
        'grape',
        'mango',
        'apple'
      ]
      let todoElements
      todos.forEach(todo => {
        input.value = todo
        button.click()
        todoElements = Array.from(list.querySelectorAll('li button'))
        const lastTodo = todoElements.find(todoEl => todoEl.textContent === todo)
        expect(lastTodo).to.exist
        expect(lastTodo.textContent).to.eq(todo)
      })

      expect(todoElements.length).to.eq(todos.length)
      todos = todos.filter(todo => todo !== 'mango')
      mangoEl = todoElements.find(todo => todo.textContent === 'mango')
      mangoEl.click()
      expect(getComputedStyle(mangoEl).textDecoration.includes('line-through')).to.be.true
      mangoEl.click()
      todoElements = Array.from(list.querySelectorAll('li button'))
      mangoEl = todoElements.find(todo => todo.textContent === 'mango')
      expect(mangoEl).to.not.exist

      todos.forEach(todo => {
        const todoEl = todoElements.find(todoEl => todoEl.textContent === todo)
        expect(todoEl).to.exist
      })
    })
  });

  mocha.run();
}
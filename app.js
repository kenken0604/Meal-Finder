//trigger
const search = document.getElementById('search')
const submit = document.getElementById('submit')
const meals = document.getElementById('meals')
const random = document.getElementById('random')

//DOM
const header = document.getElementById('result-heading')
const showMeal = document.getElementById('single-meals')

//提交表單事件(按enter可以送出，點擊事件無法)
submit.addEventListener('submit', (e) => {
  e.preventDefault()
  meals.innerHTML = ''
  showMeal.innerHTML = ''
  let input = e.target.children[0].value
  //   let input = search.value

  if (!input) return alert('Please enter something to search...')
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log(data)
      if (data.meals === null) {
        header.innerHTML = `<h4>We can't find anything about "${input}".</h4>`
      } else {
        header.innerHTML = `<h4>Here come results for "${input}":</h4>`
        meals.innerHTML = data.meals
          .map(
            (meal) => `
            <div class="meal-box">
                <img src='${meal.strMealThumb}'>
                <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
          `,
          )
          .join('')
      }
    })

  search.value = '' //清空搜尋
})

meals.addEventListener('click', async (e) => {
  //需要找到點擊的id追蹤來源
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-info') //需要返回值，返回的是含有此屬性的標籤
    } else {
      return false
    }
  })

  console.log(e.path) //陣列資料
  console.log(mealInfo) //點到h3或mealInfo都會追蹤到
  //   console.log(e.target) //可能會點到h3，而無法追蹤

  const ingredients = []

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealID') //得到此屬性的值
    console.log(mealID)

    let data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`,
    )
    let parseData = await data.json()
    let target = parseData.meals[0]
    // console.log(target['strIngredient1'])

    for (let i = 1; i <= 20; i++) {
      if (target[`strIngredient${i}`]) {
        ingredients.push(
          `${target[`strIngredient${i}`]} - ${target[`strMeasure${i}`]}`,
        )
      }
    }
    // console.log(parseData.meals[0]['strIngredient1']) //模板取值方法(因資料沒有儲存在陣列)
    // console.log(parseData.meals[0].strIngredient1) //兩種方法相同

    showMeal.innerHTML = `
    <div class="show-pic">
        <h1>${target.strMeal}</h1>
        <img src="${target.strMealThumb}">
        ${
          target.strArea
            ? `<h4><i><u>${target.strArea}</u> ${target.strCategory}</i> Cuisine</h4>`
            : ''
        }
        <div class="instruction">
            <p>${target.strInstructions}</p>
            <h2>Ingredients</h2>
            <div class="ingredients">
            ${ingredients.map((item) => `<span>${item}</span>`).join('')}
            </div>
        </div>
    </div>    
    `
  } //在模板使用判斷
})

random.addEventListener('click', () => {
  //清除之前搜尋的結果
  header.innerHTML = ''
  meals.innerHTML = ''
  showMeal.innerHTML = ''

  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log(data)

      const ingredients = []
      let target = data.meals[0]

      for (let i = 1; i <= 20; i++) {
        if (target[`strIngredient${i}`]) {
          ingredients.push(
            `${target[`strIngredient${i}`]} - ${target[`strMeasure${i}`]}`,
          )
        }
      }

      showMeal.innerHTML = `
    <div class="show-pic">
        <h1>${target.strMeal}</h1>
        <img src="${target.strMealThumb}">
        ${
          target.strArea
            ? `<h4><i><u>${target.strArea}</u> ${target.strCategory}</i> Cuisine</h4>`
            : ''
        }
        <div class="instruction">
            <p>${target.strInstructions}</p>
            <h2>Ingredients</h2>
            <div class="ingredients">
            ${ingredients.map((item) => `<span>${item}</span>`).join('')}
            </div>
        </div>
    </div>    
    `
    })
})

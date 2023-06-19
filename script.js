'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function(movements, sort = false) {

  containerMovements.innerHTML = '';

  // The slice() method is used to create a copy
  // of the array so that the underlying array
  // remains unchanged.
  
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function(mov, i) {

    const type = (mov > 0) ? 'deposit' : 'withdrawal';
    
    const html = 
    `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov} €</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);

  });
};


const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};


const calcDisplaySummary = function(acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} €`;

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} €`;

  const interest = acc.movements.filter(mov => mov > 0)
                            .map(deposit => deposit * acc.interestRate / 100)
                            .filter(int => int >= 1)
                            .reduce((acc, int) => acc + int, 0);
  
  labelSumInterest.textContent = `${interest} €`;
};


const createUsernames = function(accs) {

  accs.forEach(function(acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });

};

createUsernames(accounts);
// console.log(accounts);

const updateUI = function(acc) {
  // Display Movements
  displayMovements(acc.movements);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
}

// Event Listener & Event Handler for Login
let currentAccount;

btnLogin.addEventListener('click', function(e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});


// Event Listener and Event Handler for Transfer
btnTransfer.addEventListener('click', function(e) {
  // Prevent form from submitting
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  // Clear Input Fields
  inputTransferAmount.value = inputTransferTo.value = '';

});


// Event Listener and Event Handler for close account
btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {

    // Find (index position) account to delete in the accounts array
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  // Clear Input Fields
  inputCloseUsername.value = inputClosePin.value = '';

});


// Event Listener and Event Handler for loan
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  // Clear input text field
  inputLoanAmount.value = '';

});


// Event Listener and Event Handler for sort

let sorted = false; // State variable

btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});




/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);


// Chapter 150
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToUSD = 1.1;

// map() Method
const movementsUSD = movements.map(function(mov) {
  return mov * euroToUSD;
});

// console.log(movements);
// console.log(movementsUSD);

// Arrow Function
const movementsUSDArrow = movements.map(mov => mov * euroToUSD);

// The for-of loop
const movementsUSDfor = [];
for(const mov of movements) {
  movementsUSDfor.push(mov * euroToUSD);
}

// Another Example

const movementsDescriptions =  movements.map((mov, i, arr) => {
  if(mov > 0) {
    return `Movement ${i + 1} You deposited ${mov}`;
  } else {
    return `Movement ${i + 1} You withdrew ${Math.abs(mov)}`;
  }
});

console.log(movementsDescriptions);
*/

// Chapter 152
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function(mov) {
  return mov > 0;
});

console.log(deposits);

const depositsFor = [];

for(const mov of movements) {
  if(mov > 0) {
    depositsFor.push(mov);
  }
}

const withdrawals = movements.filter(mov => mov < 0);

console.log(withdrawals);
*/

// Chapter 153
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// reduce()
const balance = movements.reduce(function(acc, cur, i , arr) {
  console.log(`Iteration ${i}: ${acc}`);

  return acc + cur;
}, 0);

console.log(balance);

// Arrow Function
const balance2 = movements.reduce((acc, cur) => acc + cur, 0);

// for-of loop
let balance3 = 0;

for(const mov of movements) {
  balance3 += mov;
}

// Maximum Value
const max = movements.reduce((acc, mov) => {
  if(acc > mov) {
    return acc;
  } else {
    return mov;
  }
}, movements[0]);

console.log(max);
*/


/////////////////////////////////////////////////

// Chpater 142
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -1));

// Shallow Copy Array
console.log(arr.slice());
console.log('\n');

// SPLICE
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);
console.log('\n');

// REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];

console.log(arr2.reverse());
console.log(arr2);
console.log('\n');

// CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log('\n');

// JOIN

console.log(letters.join(' - '));
*/


// Chapter 143
/*
const arr = [23, 11, 64];

// Accessing Element 0
console.log(arr[0]);
console.log(arr.at(0));

// Getting last array element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

// Using the at() method with a string
console.log('Aman'.at(0));
console.log('Aman'.at(-1));
*/

// Chapter 144
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Using the for-of loop
for(const movement of movements) {
  if(movement > 0) {
    console.log(`You deposited ${movement}`);
  } else {
    console.log(`You withdrew ${Math.abs(movement)}`);
  }
}

// Accessing counter variable in for-of loop

for(const [i, movement] of movements.entries()) {
  if(movement > 0) {
    console.log(`Movement ${i + 1} You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1} You withdrew ${Math.abs(movement)}`);
  }
}

// Using the forEach() method
movements.forEach(function(mov, i, arr) {
  if(mov > 0) {
    console.log(`Movement ${i + 1} You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1} You withdrew ${Math.abs(mov)}`);
  }
});
*/

// Chapter 145
/*
// Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(value, key, map) {
  console.log(`${key}: ${value}`);
});

// Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);

currenciesUnique.forEach(function(value, key, map) {
  console.log(`${key}: ${value}`);
});
*/

// Coding Challenge 1
/*
const checkDogs = function(dogsJulia, dogsKate) {

  // Task 1:
  const juliaCopy = dogsJulia.slice();
  juliaCopy.splice(0, 1);
  juliaCopy.splice(-2);
  
  // Task 2:
  const dogs = juliaCopy.concat(dogsKate);
  console.log(dogs);

  // Task 3:
  dogs.forEach(function(dog, i) {
    if(dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult,
      and is ${dog} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy 🐶`);
    }
  });

};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
*/

// Coding Challenge 2
/*
const calcAverageHumanAge = function(ages) {
  
  // Task 1:
  const humanAges = ages.map(age => (age <= 2) ? 
  2 * age : 16 + age * 4);

  // Task 2:
  const adults = humanAges.filter(age => age >= 18);
  console.log(humanAges);
  console.log(adults);

  // Task 3:
  const average = adults.reduce((acc, age, i, arr) => acc + age / arr.length, 0);

  return average;
};

const avg1 = calcAverageHumanAge([5, 4, 2, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(avg1, avg2);
*/

// Chapter 155
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const euroToUSD = 1.1;

const totalDepositsUSD = movements.filter(mov => mov > 0)
                                  .map(mov => mov * euroToUSD)
                                  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD);
*/


// Coding Challenge 3
/*
const calcAverageHumanAge = ages => ages
                                    .map(age => (age <= 2) ? 2 * age : 16 + age * 4)
                                    .filter(age => age >= 18)
                                    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const avg1 = calcAverageHumanAge([5, 4, 2, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(avg1, avg2);
*/

// Chapter 157
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/


// Chapter 161
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
console.log(movements.includes(-130));

// SOME
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

// EVERY
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate Callback

const deposit = mov => mov > 0;

console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/

// Chapter 162
/*
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// flat()
const overallBalance = accounts.map(acc => acc.movements)
                               .flat()
                               .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

// flatMap()

const overallBalance2 = accounts.flatMap(acc => acc.movements)
                                .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);
*/

// Chapter 165
/*
// Strings
const owners = ['Aman', 'Zack', 'Adam', 'Martha'];
console.log(owners.sort());

// Numbers
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

// return < 0: a, b
// return > 0: b, a

// Ascending
// movements.sort((a, b) => {
//   if(a > b) {
//     return 1;
//   }

//   if(b > a) {
//     return -1;
//   }

// });

movements.sort((a, b) => a - b);
console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if(a > b) {
//     return -1;
//   }

//   if(b > a) {
//     return 1;
//   }

// });

movements.sort((a, b) => b - a);
console.log(movements);
*/

// Chapter 164
/*
console.log([1, 2, 3, 4, 5, 6, 7]);
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
console.log(x);

// x.fill(1);

x.fill(1, 3, 5);
console.log(x);

// Array.from()
const y = Array.from({length: 7}, () => 1);
console.log(y);

const z = Array.from({length: 7}, (_, i) => i + 1);
console.log(z);

// Version 1
// labelBalance.addEventListener('click', function() {
//   const movementsUI = Array.from(document.querySelectorAll('.movements__value'));

//   console.log(movementsUI.map(el => el.textContent.replace('€', '')));
// });

// Version 2
labelBalance.addEventListener('click', function() {
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), 
  el => Number(el.textContent.replace('€', '')));

  console.log(movementsUI);

  // const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  // console.log(movementsUI2);

});
*/

// Chapter 166
/*
// 1.
const bankDepositSum = accounts
                       .flatMap(acc => acc.movements)
                       .filter(mov => mov > 0)
                       .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);

// 2.
const numDeposits1000 = accounts
                        .flatMap(acc => acc.movements)
                        .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposits1000);

// Prefixed ++ operator
let a = 10;
console.log(++a);
console.log(a);

// 3.
const {deposits, withdrawals} = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    {deposits: 0, withdrawals: 0}
  );

console.log(deposits, withdrawals);

// 4.
const convertTitleCase = function(title) {
  const capitalise = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalise(word)))
    .join(' ');
  
  return capitalise(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/

// Coding Challenge 4
/*
const dogs = [
  {weight: 22, curFood: 25, owners: ['Alice', 'Bob']},
  {weight: 8, curFood: 200, owners: ['Matilda']},
  {weight: 13, curFood: 275, owners: ['Sarah', 'John']},
  {weight: 32, curFood: 340, owners: ['Michael']},
];

// Task 1:
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

// Task 2:
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(`Sarah's dog is eating too ${
  dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
}`);


// Task 3:
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// Task 4:
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// Task 5:
console.log(dogs.some(dog => dog.curFood === dog.recFood));

// Task 6:
const checkEatingOkay = dog => 
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
console.log(dogs.some(checkEatingOkay));

// Task 7:
console.log(dogs.filter(checkEatingOkay));

// Task 8:
const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogsSorted);
*/


import React from 'react';
import { GameTable } from './GameTable';

export class GameContainer extends React.Component {	
	constructor(props) {		
		super(props);				
		
		this.state = {			
			player: 'Player 1',
			playerSymbol: 'X', 
			rowOne: ["","",""],
			rowTwo: ["","",""],
			rowThree: ["","",""],
			emptyPlaces: [],
			game: false,
			draw: false,
			winner: false,
			winnerName: '',
			winnerSymbol: ''
		};				
		
		this.restartGame = this.restartGame.bind(this);		
		this.placeSymbol = this.placeSymbol.bind(this);	
		this.findEmptyPlaces = this.findEmptyPlaces.bind(this);
		this.computerTakesTurn = this.computerTakesTurn.bind(this);
		this.isThereAWinner = this.isThereAWinner.bind(this); 

	}
	
	arrayHasRoom(arrIndex, arr, emptyPlaces) {
		
		for(let i = 0; i < arr.length; i++) {
			if(arr[i] === "") {
				//console.log('found empty splot');
				emptyPlaces.push(arrIndex+i);
			}
		}
		//result = temp.concat(0);
		//console.log(emptyPlaces);
		/*if(!arr.length) {
			emptyPlaces = null;
		}*/
		//return emptyPlaces;
	}
	
	findEmptyPlaces(arr, arr2, arr3) {
		let emptyPlaces = [];
		
		this.arrayHasRoom('0', arr, emptyPlaces);
		this.arrayHasRoom('1', arr2, emptyPlaces);
		this.arrayHasRoom('2', arr3, emptyPlaces);
		//consol.log(emptyPlaces);
		
		return emptyPlaces.slice();
	
	}
	
	findRow(str) {
		return str === '0' ? 'rowOne'
			 : str === '1' ? 'rowTwo'
             : 'rowThree';
	}
	
	arrayEquals(a,b) {
		
		return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
	}
	
	findAndSortMissingRows(row) {
		let control = ['rowOne', 'rowTwo', 'rowThree'],
			results = [];
		
		for(let i = 0; i < control.length; i++) {
			
			const item = control[i]; 

			if(item !== row) {
				results.push(item);
			}
		}
		results.sort();
		return results.slice();
	}
	
	isThereAWinner(symbol, player, row, rowName) {
		console.log('isthereawinner',symbol,player,row,rowName);
		let missingRows = this.findAndSortMissingRows(rowName);
		console.log(symbol, player, row, rowName, missingRows);
		
		let row1, row2, row3;
		
		if(rowName === 'rowOne') {
			
			row1 = row;
			row2 = this.state[missingRows[1]].slice();
			row3 = this.state[missingRows[0]].slice();
			
		} else if(rowName === 'rowTwo') {
			
			row1 = this.state[missingRows[0]].slice();
			row2 = row;
			row3 = this.state[missingRows[1]].slice();
		
		}  else {
			
			row1 = this.state[missingRows[0]].slice();
			row2 = this.state[missingRows[1]].slice();
			row3 = row;
		
		}
		
		const comparisonArray = [symbol, symbol, symbol];
		//console.log(comparisonArray,'compare');
		const control = comparisonArray;
		const arr4 = [row1[0], row2[0], row3[0]];
		const arr5 = [row1[1], row2[1], row3[1]];
		const arr6 = [row1[2], row2[2], row3[2]];
		const arr7 = [row1[0], row2[1], row3[2]];
		const arr8 = [row3[0], row2[1], row1[2]];
		const isArr1Equal = this.arrayEquals(control, row1.slice());
		const isArr2Equal = this.arrayEquals(control, row2.slice());
		const isArr3Equal = this.arrayEquals(control, row3.slice());
		const isArr4Equal = this.arrayEquals(control, arr4.slice());
		const isArr5Equal = this.arrayEquals(control, arr5.slice());
		const isArr6Equal = this.arrayEquals(control, arr6.slice());
		const isArr7Equal = this.arrayEquals(control, arr7.slice());
		const isArr8Equal = this.arrayEquals(control, arr8.slice());
		//console.log(control, row1, row2, row3, arr4, arr5, arr6, arr7, arr8, isArr1Equal, isArr2Equal, isArr3Equal,	isArr4Equal, isArr5Equal, isArr6Equal, isArr7Equal, isArr8Equal);
			
			if( isArr1Equal ||
			    isArr2Equal ||
			    isArr3Equal ||
				isArr4Equal ||
				isArr5Equal ||
				isArr6Equal ||
				isArr7Equal ||
				isArr8Equal ) {
					console.log('isThereAWinner someone satisfied the if conditions');
					const obj = {
						winner: true,
						winnerName: player,
						winnerSymbol: symbol,
						game: false
					};
					return obj;
				} else {
					
					console.log('isThereAWinner someone did not satisfy the if conditions')
					return false;
				}
		
	}
	
	computerTakesTurn() {
		
		let places = this.findEmptyPlaces(this.state.rowOne, this.state.rowTwo, this.state.rowThree),
			obj = {
				player: this.state.player === 'Computer' ? 'Player 1' : 'Computer',
				playerSymbol: this.state.playerSymbol === 'O' ? 'X' : 'O'
		};
		console.log('component update find places', places);
		
		if(!places.length) {
			
			this.setState({
				draw: true,
				game: false
			});
			
			return;
			
		}
		const index = Math.floor(Math.random() * places.length),
		      item = places[index],
			  row = this.findRow(item[0]),
			  /*missingRows = this.findMissingRows(row),
			  row2 = missingRows[0],
			  row3 = missingRows[1],*/
			  arrIndex = parseInt(item[1]),
		      temp = this.state[row].slice(),
			  placesPropName = 'emptyPlaces';
		
		places.splice(index, 1);
		obj[placesPropName] = places;
		//console.log('component update fixing', places);
		temp[arrIndex] = this.state.playerSymbol;
		//console.log('temp', arrIndex, this.state.playerSymbol, temp);
		//console.log('missing rows :',row, row2, row3);
		obj[row] = temp;
		const win = this.isThereAWinner(this.state.playerSymbol, this.state.player, obj[row], row);
		
		if(win) {
			console.log('before change: ',obj);
			const stateObject = Object.assign({}, obj, win);
			obj = stateObject;
			console.log('after change: ',obj);
		}
		
		setTimeout(() => {
			
			this.setState(obj);
			
		}, 1500);
		
		//console.log('computertakesturn right before setState',row, missingRows, obj[row], this.state[row2]);
		
	}
	
	/*componentWillMount(){
		
		const places = this.findEmptyPlaces(this.state.rowOne, this.state.rowTwo, this.state.rowThree);
		this.setState({
			emptyPlaces: places
		});
		
	}*/
	
	componentDidUpdate(prevProps, prevState) {
		
		console.log('inside component did update',this.state.winner,this.state.draw, this.state.emptyPlaces.length);
		if(!this.state.winner && !this.state.draw /*&& this.state.emptyPlaces.length */&& this.state.player !== 'Player 1') {

			console.log('inside component did update first if');
			this.computerTakesTurn();
			
		}/* else if (!this.state.winner && !this.state.draw && !this.state.emptyPlaces.length) {
			
			console.log('inside component did update second if');
			this.setState({
				draw: true
			});
		}*/
		
		
	}
	
	restartGame() {
		
		this.setState({	
			player: 'Player 1',
			playerSymbol: 'X', 
			rowOne: ["","",""],
			rowTwo: ["","",""],
			rowThree: ["","",""],
			emptyPlaces: [],
			game: false,
			draw: false,
			winner: false,
			winnerName: '',
			winnerSymbol: ''
		});
	
	}		
	
	placeSymbol(stateObject) {		
		
		//const obj = {};		
		//obj[position] = arr;		
		console.log('inside symbol',stateObject);		
		this.setState(stateObject);	
	
	}			
	
	render () {		
		
		let stringify = JSON.stringify(this.state);		
		console.log(stringify,'rendering');		
		
		return <GameTable player={this.state.player} symbol={this.state.playerSymbol} one={this.state.rowOne} two={this.state.rowTwo} three={this.state.rowThree} game={this.state.game} draw={this.state.draw} winner={this.state.winner} winnerName={this.state.winnerName} winnerSymbol={this.state.winnerSymbol} arrayEquals={this.arrayEquals} getMissingRows={this.findMissingRows} didIWin={this.isThereAWinner} restart={this.restartGame} place={this.placeSymbol}/>;
		
	}	
}
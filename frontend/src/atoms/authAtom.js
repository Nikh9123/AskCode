import {atom} from 'recoil' ;

const authScreenAtom = atom({
  key: 'authScreenAtom', // key is an unique ID (with the scope of current atom) it is used for identify the atom
  default: 'login' // default value of the atom
})

export default authScreenAtom ;
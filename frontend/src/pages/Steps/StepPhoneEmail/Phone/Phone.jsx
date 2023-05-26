import React, { useState } from 'react'
import Card from '../../../../components/shared/card/Card'
import Button from '../../../../components/shared/button/Button'
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css'
import {sendOtp} from "../../../../http/index"
import { useDispatch } from 'react-redux';
import {setOtp} from "../../../../store/authSlice"
// import { set } from 'mongoose';
const Phone = ({onNext}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const dispatch = useDispatch()
  const submit = async () => {
    if(!phoneNumber) return;
    try {
      const {data} = await sendOtp({phone: phoneNumber})
      console.log(data)
      dispatch(setOtp({phone: data.phone, hash: data.hash}))
      onNext();
    } catch(error) {
      console.log(error.message)
    }
    
  }
  return (
    <Card title="Enter your phone number" icon="phone">
      <TextInput value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <div>
                <div className={styles.actionButtonWrap}>

                  <Button  text="Next" onClick={submit}/>
                </div>
                <p className={styles.bottomParagraph}>
                  By entering your number, your're agreeing to our Terms of Service and Privacy Policy. Thanks!
                </p>
              </div>
              
    </Card>
  )
}

export default Phone
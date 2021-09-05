import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import logoPic from '../../public/logo-with-text.png'
import React, {useRef,  useState } from 'react';

export default function controls() {
	  const [remaining, setRemaining] = useState(5000);
  return (
  	<div className={styles.box_wrapper}>

	    <div className={styles.control_big_box}>
	    	<div className={styles.div_wrapper}>Mint Status: Unavailable</div>
	    	<div className={styles.div_wrapper}>Mint Price: 0.05 Ξ</div>
	    	<div className={styles.div_wrapper}>Amount: {remaining} Kongs</div>
	    </div>
	    <div className={styles.control_small_box}>
	    	<p className={styles.bet_p}>Available to Mint:</p>
	    	<div className={styles.div_wrapper}>
	    		<span className={styles.div_wrapper_input}>5000 Kongs</span>
	    	</div>
	    </div>
	    <div className={styles.control_big_box}>
	    	<p className={styles.time_left}>Mint</p>
	    	<div className={styles.button_wrapper}>
		    	<div className={styles.button_box}>1x</div>
		    	<div className={styles.button_box}>5x</div>
		    	<div className={styles.button_box}>10x</div>
	    	</div>

		    <div className={styles.button_box_send}>Mint</div>
	    </div>

  	</div>  
  	)
}

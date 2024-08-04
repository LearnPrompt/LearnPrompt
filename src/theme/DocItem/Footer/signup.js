import { FaBusinessTime, FaCertificate, FaList, FaQuestionCircle } from "react-icons/fa";

import React from 'react';
import classes from './signup.module.css';

export default function SignUp() {
  return (
    <section className={classes.main}>
      <div className={classes.cols}>
        <div className={classes.email}>
          <div>
            <strong style={{ marginTop: 12 }}>
              <h3 style={{ marginBottom: 4 }}>Don't get left behind on AI</h3>
            </strong>
            <strong style={{ fontSize: 16 }}>
              <a href="https://quail.ink/aiwarts101" style={{ color: 'black', fontWeight: 'bold', textDecoration: 'underline' }}>📮 Subscribe Our Newsletter and get the latest AI news, prompts, and tools.</a>
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

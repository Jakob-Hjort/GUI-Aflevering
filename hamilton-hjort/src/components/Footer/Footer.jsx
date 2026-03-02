import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footerGrid">
        <div>
          <div className="footerTitle">CUSTOMER SERVICE</div>
          <ul className="footerList">
            <li>FAQ</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
            <li>Cookies</li>
            <li>Contact us</li>
          </ul>
        </div>

        <div>
          <div className="footerTitle">ABOUT HAMILTON-HJORT</div>
          <ul className="footerList">
            <li>About the company</li>
            <li>Job & career</li>
            <li>Newsletter</li>
            <li>Stores</li>
            <li>Responsibility</li>
          </ul>
        </div>

        <div>
          <div className="footerHeadline">News from HAMILTON-HJORT</div>
          <p className="footerText">
            Join our newsletter and get updates on new drops and exclusive offers.
          </p>
          <div className="footerForm">
            <input className="footerInput" placeholder="Your email" />
            <button className="footerBtn">Sign up</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const LANDING_STYLESHEET_IDS = [
  'tunilink-bootstrap',
  'tunilink-fontawesome',
  'tunilink-hero-slider',
  'tunilink-datepicker',
  'tunilink-owl',
  'tunilink-style',
] as const;

const LANDING_STYLESHEET_HREFS = [
  '/css/bootstrap.min.css',
  '/css/fontAwesome.css',
  '/css/hero-slider.css',
  '/css/datepicker.css',
  '/css/owl-carousel.css',
  '/css/templatemo-style.css',
];

export function removeLandingStylesheets() {
  LANDING_STYLESHEET_IDS.forEach((id) => {
    document.getElementById(id)?.remove();
  });
}

export default function LandingPage() {
  useEffect(() => {
    document.title = 'TuniLink';

    LANDING_STYLESHEET_HREFS.forEach((href, index) => {
      const id = LANDING_STYLESHEET_IDS[index];
      if (document.getElementById(id)) return;
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    });

    return () => {
      removeLandingStylesheets();
    };
  }, []);

  return (
      <div className="landing-wrapper">
        <div className="wrap">
          <header id="header">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <button id="primary-nav-button" type="button">Menu</button>
                  <Link to="/">
                    <div className="logo">
                      <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1E3A8A', letterSpacing: '-0.02em' }}>
                        TuniLink
                      </span>
                    </div>
                  </Link>
                  <nav id="primary-nav" className="dropdown cf">
                    <ul className="dropdown menu">
                      <li className="active"><a href="#popular">Features</a></li>
                      <li><a href="#blog">About</a></li>
                      <li><a href="#contact">Contact</a></li>
                      <li><Link className="scrollTo" to="/login">Login</Link></li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </header>
        </div>

        <section className="banner" id="top">
          <div className="container">
            <div className="row">
              <div className="col-md-10 col-md-offset-1">
                <div className="banner-caption">
                  <div className="line-dec"></div>
                  <h2>TuniLink</h2>
                  <span>
                    Tunisia–Canada recruitment and cost-management platform.
                    Centralize employee data, automate payroll workflows, and
                    connect HR, Finance, Clients, and Infrastructure teams.
                  </span>
                  <div className="blue-button">
                    <Link className="scrollTo" to="/login">Login to TuniLink</Link>
                  </div>
                </div>
                <div className="submit-form">
                  <form id="form-submit" action="" method="get">
                    <div className="row">
                      <div className="col-md-3 first-item">
                        <fieldset>
                          <input name="name" type="text" className="form-control" id="hero-name" placeholder="Your name..." required />
                        </fieldset>
                      </div>
                      <div className="col-md-3 second-item">
                        <fieldset>
                          <input name="location" type="text" className="form-control" id="location" placeholder="Type location..." required />
                        </fieldset>
                      </div>
                      <div className="col-md-3 third-item">
                        <fieldset>
                          <select required name="category">
                            <option value="">Select category...</option>
                            <option value="Shops">Shops</option>
                            <option value="Hotels">Hotels</option>
                            <option value="Restaurants">Restaurants</option>
                            <option value="Events">Events</option>
                            <option value="Meetings">Meetings</option>
                            <option value="Fitness">Fitness</option>
                            <option value="Cafes">Cafes</option>
                          </select>
                        </fieldset>
                      </div>
                      <div className="col-md-3">
                        <fieldset>
                          <button type="submit" className="btn">Search Now</button>
                        </fieldset>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="popular-places" id="popular">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="section-heading">
                  <span>Built for every partner</span>
                  <h2>Who uses TuniLink</h2>
                </div>
              </div>
            </div>
            <div className="owl-carousel owl-theme">
              {[
                { img: "popular_item_1.jpg", title: "HR", count: "Contracts & employees" },
                { img: "popular_item_2.jpg", title: "Finance", count: "Payroll & margins" },
                { img: "popular_item_3.jpg", title: "Clients", count: "Team & simulations" },
                { img: "popular_item_4.jpg", title: "Infrastructure", count: "Costs & resources" },
                { img: "popular_item_5.jpg", title: "Employees", count: "Payslips & leave" },
                { img: "popular_item_1.jpg", title: "Admin", count: "Users & companies" },
              ].map((place, i) => (
                <div className="item popular-item" key={i}>
                  <div className="thumb">
                    <img src={`/img/${place.img}`} alt={place.title} />
                    <div className="text-content">
                      <h4>{place.title}</h4>
                      <span>{place.count}</span>
                    </div>
                    <div className="plus-button">
                      <a href="#"><i className="fa fa-plus"></i></a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="featured-places" id="blog">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="section-heading">
                  <span>Why TuniLink</span>
                  <h2>One platform for every role</h2>
                </div>
              </div>
            </div>
            <div className="row">
              {[
                { img: "featured_item_1.jpg", day: "HR", month: "Team", title: "Employee & contract management", cat: "Human Resources", text: "Onboard talent, manage contracts, and submit payroll inputs for Canadian client projects." },
                { img: "featured_item_2.jpg", day: "FIN", month: "Ops", title: "Payroll, margins & invoices", cat: "Finance", text: "Calculate margins, process payroll, and bill Canadian clients with full cost visibility." },
                { img: "featured_item_3.jpg", day: "CLI", month: "CA", title: "Team visibility & simulations", cat: "Canadian Clients", text: "Review your assigned team, run salary simulations, and track invoices in real time." },
              ].map((item, i) => (
                <div className="col-md-4 col-sm-6 col-xs-12" key={i}>
                  <div className="featured-item">
                    <div className="thumb">
                      <img src={`/img/${item.img}`} alt={item.title} />
                      <div className="overlay-content">
                        <ul>
                          {[...Array(5)].map((_, s) => (
                            <li key={s}><i className="fa fa-star"></i></li>
                          ))}
                        </ul>
                      </div>
                      <div className="date-content">
                        <h6>{item.day}</h6>
                        <span>{item.month}</span>
                      </div>
                    </div>
                    <div className="down-content">
                      <h4>{item.title}</h4>
                      <span>{item.cat}</span>
                      <p>{item.text}</p>
                      <div className="row">
                        <div className="col-md-6 first-button">
                          <div className="text-button">
                            <a href="#">Add to favorites</a>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="text-button">
                            <a href="#">Continue Reading</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="our-services" id="services">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="section-heading">
                  <span>Our Services</span>
                  <h2>Best Template Site</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="service-item">
                  <div className="icon">
                    <img src="/img/service_icon_1.png" alt="" />
                  </div>
                  <h4>High Quality Design</h4>
                  <p>Etiam viverra nibh at lorem hendrerit porta non nec ligula. Donec hendrerit porttitor pretium. Suspendisse fermentum nec risus.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="service-item">
                  <div className="icon">
                    <img src="/img/service_icon_2.png" alt="" />
                  </div>
                  <h4>Fully Customizable</h4>
                  <p>Vivamus nec vehicula felis, sit amet convallis ex. Aenean dolor risus, rutrum at tincidunt eget, placerat ac mauris.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="service-item">
                  <div className="icon">
                    <img src="/img/service_icon_3.png" alt="" />
                  </div>
                  <h4>Best HTML CSS Layout</h4>
                  <p>Praesent nec dui sed urna pharetra dapibus at ac elit. Aenean hendrerit metus leo, quis viverra purus condimentum nec.</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="down-services">
                  <div className="row">
                    <div className="col-md-5 col-md-offset-1">
                      <div className="left-content">
                        <h4>Replace time-consuming monthly meetings with a centralized platform where every department collaborates in real time. All changes are tracked, validated, and accessible according to user roles.</h4>
                        
                        <div className="blue-button">
                          <a href="#">Login</a>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="accordions">
                        <ul className="accordion">
                          <li>
                            <a>Ut in dapibus ipsum</a>
                            <p>Nulla eget aliquet dui, vitae tincidunt nulla. Sed sagittis odio vitae auctor volutpat. In semper ex neque, ut hendrerit mauris rutrum eget. Integer consectetur neque eu enim dictum porta. Sed et risus ac sapien congue mattis.</p>
                          </li>
                          
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="video-container">
          <div className="video-overlay"></div>
          <div className="video-content">
            <div className="inner">
              <span>Video Presentation</span>
              <h2>Sed et risus ac sapien congue mattis.</h2>
              <a href="http://youtube.com" target="_blank" rel="noreferrer"><i className="fa fa-play"></i></a>
            </div>
          </div>
          <video autoPlay loop muted>
            <source src="/highway-loop.mp4" type="video/mp4" />
          </video>
        </section>

       
        <section className="contact" id="contact">
          <div id="map">
            {/* To change the map: Google Maps -> click your location -> Share -> Embed map -> copy src URL below */}
            <iframe
              title="location-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1197183.8373802372!2d-1.9415093691103689!3d6.781986417238027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdb96f349e85efd%3A0xb8d1e0b88af1f0f5!2sKumasi+Central+Market!5e0!3m2!1sen!2sth!4v1532967884907"
              width="100%"
              height="500px"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen
            ></iframe>
          </div>
          <div className="container">
            <div className="col-md-10 col-md-offset-1">
              <div className="wrapper">
                <div className="section-heading">
                  <span>Contact Us</span>
                  <h2>Vivamus nec vehicula felis</h2>
                </div>
                <button id="modBtn" className="modal-btn">Talk to us</button>
              </div>
              <div id="modal" className="modal">
                <div className="modal-content">
                  <div className="close fa fa-close"></div>
                  <div className="row">
                    <div className="col-md-8">
                      <div className="left-content">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="section-heading">
                              <span>Talk To Us</span>
                              <h2>Let's have a discussion</h2>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <fieldset>
                              <input name="contactName" type="text" className="form-control" id="contact-name" placeholder="Your name..." required />
                            </fieldset>
                          </div>
                          <div className="col-md-6">
                            <fieldset>
                              <input name="subject" type="text" className="form-control" id="subject" placeholder="Subject..." required />
                            </fieldset>
                          </div>
                          <div className="col-md-12">
                            <fieldset>
                              <textarea name="message" rows={6} className="form-control" id="message" placeholder="Your message..." required></textarea>
                            </fieldset>
                          </div>
                          <div className="col-md-12">
                            <fieldset>
                              <button type="submit" className="btn">Send Message</button>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="right-content">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="content">
                              <div className="section-heading">
                                <span>More About Us</span>
                                <h2>TuniLink</h2>
                              </div>
                              <p>
                                TuniLink connects Tunisian recruitment agencies with Canadian clients —
                                managing contracts, payroll margins, invoices, and employee workspaces in one place.
                              </p>
                              <ul>
                                <li><span>Phone:</span><a href="#">+216 00 000 000</a></li>
                                <li><span>Email:</span><a href="mailto:contact@tunilink.com">contact@tunilink.com</a></li>
                                <li><span>Address:</span><a href="#">Tunis, Tunisia · Canada</a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <div className="container">
            <div className="row">
              <div className="col-md-5">
                <div className="about-veno">
                  <div className="logo">
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>TuniLink</span>
                  </div>
                  <p>
                    TuniLink is the multi-actor platform for Tunisia–Canada recruitment:
                    HR, Finance, Clients, Infrastructure providers, and Employees — all in sync.
                  </p>
                  <ul className="social-icons">
                    <li>
                      <a href="#"><i className="fa fa-facebook"></i></a>
                      <a href="#"><i className="fa fa-twitter"></i></a>
                      <a href="#"><i className="fa fa-linkedin"></i></a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-4">
                <div className="useful-links">
                  <div className="footer-heading">
                    <h4>Useful Links</h4>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <ul>
                        <li><Link to="/login"><i className="fa fa-stop"></i>Login</Link></li>
                        <li><a href="#popular"><i className="fa fa-stop"></i>Features</a></li>
                        <li><a href="#blog"><i className="fa fa-stop"></i>About</a></li>
                        <li><a href="#contact"><i className="fa fa-stop"></i>Contact</a></li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul>
                        <li><a href="#"><i className="fa fa-stop"></i>HR Workspace</a></li>
                        <li><a href="#"><i className="fa fa-stop"></i>Finance</a></li>
                        <li><a href="#"><i className="fa fa-stop"></i>Clients</a></li>
                        <li><a href="#"><i className="fa fa-stop"></i>Employees</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="contact-info">
                  <div className="footer-heading">
                    <h4>Contact Information</h4>
                  </div>
                  <p>Reach the TuniLink team for partnerships, onboarding, and support.</p>
                  <ul>
                    <li><span>Phone:</span><a href="#">+216 00 000 000</a></li>
                    <li><span>Email:</span><a href="mailto:contact@tunilink.com">contact@tunilink.com</a></li>
                    <li><span>Address:</span><a href="#">Tunis · Montreal</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>

        <div className="sub-footer">
          <p>
            Copyright &copy; {new Date().getFullYear()} TuniLink — Tunisia–Canada recruitment platform
          </p>
        </div>
      </div>
    );
  }
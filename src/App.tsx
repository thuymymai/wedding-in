import { FormEvent, useEffect, useRef, useState } from "react";
import { supabase } from "./lib/supabase";

const weddingDate = new Date("2026-11-12T16:00:00+07:00");

function getCountdown() {
  const distance = Math.max(0, weddingDate.getTime() - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

const timeline = [
  {
    time: "09:00",
    place: "Nhà gái",
    title: "Lễ Vu Quy",
    location:
      "Phòng 2201, Tòa CT2, Chung cư Hyundai Hillstate, Hà Đông, Hà Nội",
    note: "Nghi lễ được cử hành tại tư gia nhà gái.",
    icon: "/assets/clipart_03.png",
  },
  {
    time: "10:30",
    place: "Nhà trai",
    title: "Lễ Thành Hôn",
    location: "Phòng 205, Tòa N4AB, 52 Lê Văn Lương, Yên Hòa, Hà Nội",
    note: "Nghi lễ được cử hành tại tư gia nhà trai.",
    icon: "/assets/clipart_05.png",
  },
  {
    time: "17:30",
    place: "Mipec Palace",
    title: "Tiệc Cưới",
    location: "Sảnh 1, 229 Tây Sơn, phường Kim Liên, Hà Nội",
    note: "Hân hạnh đón bạn đến chung vui cùng gia đình chúng mình.",
    icon: "/assets/clipart_06.png",
    featured: true,
  },
];

function IllustratedDivider({ src }: { src: string }) {
  return (
    <div className="illustrated-divider" aria-hidden="true">
      <span />
      <img src={src} alt="" />
      <span />
    </div>
  );
}

function App() {
  const [countdown, setCountdown] = useState(getCountdown);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("cover-locked", !isInvitationOpen);
    return () => document.body.classList.remove("cover-locked");
  }, [isInvitationOpen]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;

    const removeUnlockListeners = () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };

    const unlockAudio = (event: Event) => {
      if (
        event.target instanceof Element &&
        event.target.closest(".music-toggle")
      )
        return;
      void audio
        .play()
        .then(removeUnlockListeners)
        .catch(() => undefined);
    };

    void audio.play().catch(() => {
      window.addEventListener("pointerdown", unlockAudio);
      window.addEventListener("keydown", unlockAudio);
    });

    return removeUnlockListeners;
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play().catch(() => setIsMusicPlaying(false));
    } else {
      audio.pause();
    }
  };

  const openInvitation = () => {
    setIsInvitationOpen(true);
    void audioRef.current?.play().catch(() => undefined);
  };

  const submitRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    const formData = new FormData(event.currentTarget);
    const guestName = String(formData.get("name") ?? "").trim();
    const attending = formData.get("attending");
    const message = String(formData.get("message") ?? "").trim();

    if (!supabase) {
      setSubmitError(
        "Chưa kết nối được hệ thống phản hồi. Vui lòng thử lại sau.",
      );
      return;
    }

    if (!guestName || (attending !== "yes" && attending !== "no")) {
      setSubmitError("Vui lòng điền tên và chọn khả năng tham dự.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("rsvps").insert({
      guest_name: guestName,
      attending: attending === "yes",
      message: message || null,
    });

    setIsSubmitting(false);

    if (error) {
      console.error("Unable to save RSVP", error);
      setSubmitError(
        "Chưa gửi được phản hồi. Vui lòng kiểm tra kết nối và thử lại.",
      );
      return;
    }

    setSubmitted(true);
  };

  return (
    <main className="invitation">
      <section
        className={`invitation-cover${isInvitationOpen ? " is-open" : ""}`}
        aria-hidden={isInvitationOpen}
      >
        <div className="invitation-cover__inner">
          <button
            className="cover-hearts"
            type="button"
            onClick={openInvitation}
            aria-label="Mở thiệp cưới của Trang và Kiệt"
          >
            <img src="/assets/invitation-heart-cover.jpeg" alt="" />
            <span className="cover-monogram" aria-hidden="true">
              T &amp; K
            </span>
          </button>
          <p>Chạm vào trái tim để mở</p>
        </div>
      </section>

      <audio
        ref={audioRef}
        src="/audio/baby-im-yours.mp3"
        autoPlay
        loop
        playsInline
        preload="auto"
        onPlay={() => setIsMusicPlaying(true)}
        onPause={() => setIsMusicPlaying(false)}
      />

      <button
        className={`music-toggle${isMusicPlaying ? " is-playing" : ""}`}
        type="button"
        onClick={toggleMusic}
        aria-pressed={isMusicPlaying}
        aria-label={isMusicPlaying ? "Tạm dừng nhạc nền" : "Phát nhạc nền"}
      >
        <span className="music-toggle__icon" aria-hidden="true">
          ♪
        </span>
        <span>{isMusicPlaying ? "Tạm dừng" : "Phát nhạc"}</span>
      </button>

      {/* <nav className="mini-nav" aria-label="Điều hướng thiệp cưới">
        <a href="#story">Chuyện chúng mình</a>
        <a href="#details">Ngày cưới</a>
        <a href="#rsvp">Phản hồi</a>
      </nav> */}

      <header className="hero" id="home">
        <img
          className="hero-art"
          src="/assets/DSC07406.jpeg"
          srcSet="/assets/DSC07406-mobile.jpeg 1200w, /assets/DSC07406.jpeg 4000w"
          sizes="100vw"
          alt="Những khoảnh khắc trong câu chuyện của chúng mình"
          fetchPriority="high"
        />
        <div className="hero-wash" />
        <div className="hero-copy">
          <p className="save-the-date">Save the date</p>
          <h1>
            Trang <i>&amp;</i> Kiệt
          </h1>
          <p className="hero-note">chính thức về chung một nhà!</p>
          <div className="venue-icon" aria-hidden="true">
            <img src="/assets/clipart-save-the-date-stamp.png" alt="" />
          </div>
          <div className="date-lockup">
            <strong>12 · 11 · 2026</strong>
            <span>Hà Nội, Việt Nam</span>
          </div>
        </div>
        <span className="scroll-note">
          <b>↓</b>
        </span>
      </header>

      <section className="paper-section welcome" id="story">
        <p className="eyebrow">Từ bạn học đến bạn đời</p>
        <IllustratedDivider src="/assets/clipart-cupids.png" />
        <div className="story-grid">
          <div className="story-copy">
            <article className="story-chapter">
              <span>Hà Nội · Những năm cấp 2</span>
              <h3>Ngày đầu ở Marie Curie</h3>
              <p>
                Chúng mình gặp nhau và làm bạn từ thời cấp 2 ở Marie Curie. Khi
                ấy, chẳng ai nghĩ rằng sau này hai đứa lại có thể trở thành một
                phần quan trọng trong cuộc đời của nhau.
              </p>
            </article>

            <div className="story-interlude" aria-hidden="true">
              <img src="/assets/clipart_14.png" alt="" />
            </div>

            <article className="story-chapter">
              <span>Verona · Ngày gặp lại</span>
              <h3>Một chương mới</h3>
              <p>
                Sau nhiều năm, chúng mình gặp lại ở Verona. Cuộc gặp ấy dường
                như mở ra một chương hoàn toàn mới.
              </p>
            </article>

            <div className="story-interlude" aria-hidden="true">
              <img src="/assets/clipart_25.png" alt="" />
            </div>

            <article className="story-chapter">
              <span>Pháp - Ý · Những ngày yêu xa</span>
              <h3>Luôn chọn nhau</h3>
              <p>
                Dù anh ở Pháp, em ở Ý, chúng mình vẫn luôn vì nhau mà cố gắng
                để rồi cuối cùng có thể về chung một nhà.
              </p>
            </article>

            <div className="story-interlude story-interlude--floral" aria-hidden="true">
              <img src="/assets/clipart_09.png" alt="" />
            </div>

            <article className="story-chapter">
              <span>Hà Nội · 12 tháng 11 năm 2026</span>
              <h3>Điểm đến là mãi mãi</h3>
              <p>
                Chúng mình biết rằng tình yêu không chỉ là những khoảnh khắc
                lãng mạn, mà còn là sự kiên nhẫn, thấu hiểu và cùng nhau vượt
                qua mọi thử thách.
              </p>
              
            </article>
          </div>
          <figure className="story-card taped">
            <img
              src="/assets/DSC07671.jpeg"
              alt="Những kỷ niệm được minh họa trong hành trình bên nhau"
              loading="lazy"
            />
          </figure>
          <p className="story-closing">
                Và chúng mình mong có bạn ở khoảnh khắc bắt đầu ấy.
              </p>
        </div>
      </section>

      

      <section className="ink-section">
        <div className="section-heading light">
          <span className="script-mark">Lịch trình</span>
          <h2>Ngày Hạnh Phúc</h2>
          <p>
            Cảm ơn các bạn đã trở thành một phần quan trọng trong ngày đặc biệt
            này.
          </p>
        </div>
        <div className="timeline">
          {timeline.map((item, index) => (
            <article
              className={`timeline-item${item.featured ? " is-featured" : ""}`}
              key={`${item.place}-${item.time}`}
            >
              <div className="timeline-time">
                <strong>{item.time}</strong>
                <span>12 · 11 · 2026</span>
                {/* <img
                  className="timeline-time-icon"
                  src={item.icon}
                  alt=""
                  aria-hidden="true"
                /> */}
              </div>
              <div className="timeline-marker">
                <i>{index + 1}</i>
              </div>
              <div className="timeline-content">
                <div className="timeline-place-row">
                  <span className="timeline-place">{item.place}</span>
                  {item.featured && (
                    <span className="timeline-featured">Sự kiện chính</span>
                  )}
                </div>
                <h3>{item.title}</h3>
                <address>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Mở ${item.place} trên Google Maps`}
                  >
                    <span>{item.location}</span>
                  </a>
                </address>
                <p>{item.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="paper-section collage-section" aria-label="Khoảnh khắc của Trang và Kiệt">
        <div className="photo-collage">
          <div className="collage-grid">
            <figure className="collage-photo collage-photo--one">
              <img
                src="/assets/DSC07158.jpeg"
                alt="Trang và Kiệt cùng bó hoa trên phố"
                loading="lazy"
              />
            </figure>
            <figure className="collage-photo collage-photo--two">
              <img
                src="/assets/DSC07256.jpeg"
                alt="Trang và Kiệt bên nhau trong ngày cưới"
                loading="lazy"
              />
            </figure>
            <figure className="collage-photo collage-photo--three">
              <img
                src="/assets/DSC07346.jpeg"
                alt="Trang và Kiệt bên nhau dưới hàng cây"
                loading="lazy"
              />
            </figure>
          </div>
          <span className="collage-heart" aria-hidden="true" />
        </div>
      </section>
<section className="ink-section rsvp-section" id="rsvp">
        <div className="section-heading light">
          <span className="script-mark">Mời bạn</span>
          <h2>Đến Chung Vui</h2>
        </div>
        {submitted ? (
          <div className="success-card">
            <span>♥</span>
            <h3>Chúng mình đã nhận được phản hồi!</h3>
            <p>Cảm ơn bạn. Hẹn gặp nhau trong ngày vui nhé!</p>
            <button type="button" onClick={() => setSubmitted(false)}>
              Chỉnh sửa phản hồi
            </button>
          </div>
        ) : (
          <form className="rsvp-form" onSubmit={submitRsvp}>
            <label>
              <span>Họ và tên</span>
              <input
                name="name"
                maxLength={120}
                autoComplete="name"
                required
              />
            </label>
            <fieldset>
              <legend>Bạn sẽ đến chung vui chứ?</legend>
              <label>
                <input type="radio" name="attending" value="yes" required />{" "}
                Mình sẽ tham dự
              </label>
              <label>
                <input type="radio" name="attending" value="no" /> Rất tiếc,
                mình không thể đến
              </label>
            </fieldset>
            <label>
              <span>Lời nhắn gửi</span>
              <textarea
                name="message"
                rows={2}
                maxLength={1000}
              />
            </label>
            {submitError && (
              <p className="rsvp-error" role="alert">
                {submitError}
              </p>
            )}
            <button
              className="ticket-button light-ticket"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang gửi…" : "Gửi phản hồi"}
            </button>
          </form>
        )}
      </section>
      <section className="paper-section countdown-section">
        <div className="line-couple" aria-hidden="true">
          <img src="/assets/clipart_24.png" alt="" />
        </div>
        <h2>Đếm ngược ngày vui!</h2>
        <div className="countdown" aria-live="polite">
          {[
            ["Ngày", countdown.days],
            ["Giờ", countdown.hours],
            ["Phút", countdown.minutes],
            ["Giây", countdown.seconds],
          ].map(([label, value]) => (
            <div key={label}>
              <strong>{String(value).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <p className="countdown-note">Mong sớm được gặp bạn!</p>
      </section>

      

      <footer>
        <img
          className="footer-heart"
          src="/assets/heart-childhood-composite.png"
          alt="Ảnh tuổi thơ của Trang và Kiệt trong khung trái tim"
        />
        <a href="#home">Trang &amp; Kiệt</a>
        <span>12 · 11 · 2026</span>
      </footer>
    </main>
  );
}

export default App;

import { FormEvent, useEffect, useRef, useState } from "react";
import { supabase } from "./lib/supabase";

const weddingDate = new Date("2026-11-12T16:00:00+07:00");
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

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
      "Phòng 2201, Tòa CT2, Chung cư Hyundai Hillstate, phường Hà Đông, Hà Nội",
    note: "Nghi lễ được cử hành tại tư gia nhà gái.",
    icon: asset("assets/clipart_03.png"),
  },
  {
    time: "10:30",
    place: "Nhà trai",
    title: "Lễ Thành Hôn",
    location: "Phòng 205, Tòa N4AB, 52 Lê Văn Lương, phường Yên Hòa, Hà Nội",
    note: "Nghi lễ được cử hành tại tư gia nhà trai.",
    icon: asset("assets/clipart_05.png"),
  },
  {
    time: "17:30",
    place: "Mipec Palace",
    title: "Tiệc Cưới",
    location: "Sảnh 1, 229 Tây Sơn, phường Kim Liên, Hà Nội",
    note: "Gia đình chúng mình hân hạnh được đón tiếp.",
    icon: asset("assets/clipart_06.png"),
    featured: true,
  },
];

const calendarDescription = [
  "09:00 - Lễ Vu Quy tại nhà gái",
  "10:30 - Lễ Thành Hôn tại nhà trai",
  "17:30 - Tiệc cưới tại Mipec Palace (sự kiện chính)",
].join("\n");

const googleCalendarUrl =
  "https://calendar.google.com/calendar/render?" +
  new URLSearchParams({
    action: "TEMPLATE",
    text: "Đám cưới Trang & Kiệt",
    dates: "20261112T020000Z/20261112T140000Z",
    details: calendarDescription,
    location: "Mipec Palace, Sảnh 1, 229 Tây Sơn, Hà Nội",
  }).toString();

const carouselPhotos = [
  {
    src: asset("assets/DSC07158.jpeg"),
    alt: "Trang và Kiệt cùng bó hoa trên phố",
    position: "50% 70%",
  },
  {
    src: asset("assets/DSC06904.jpeg"),
    alt: "Trang và Kiệt bên nhau trong bộ ảnh cưới",
    position: "50% 62%",
  },
  {
    src: asset("assets/DSC06941.jpeg"),
    alt: "Trang và Kiệt trò chuyện bên khung cửa",
    position: "50% 68%",
  },
  {
    src: asset("assets/DSC06972.jpeg"),
    alt: "Kiệt hôn Trang trước khung cửa cổ",
    position: "50% 64%",
  },
  {
    src: asset("assets/DSC07045.jpeg"),
    alt: "Một khoảnh khắc dịu dàng của Trang và Kiệt",
    position: "50% 62%",
  },
  {
    src: asset("assets/DSC07084.jpeg"),
    alt: "Trang và Kiệt trong bộ ảnh cưới tại Paris",
    position: "50% 62%",
  },
  {
    src: asset("assets/DSC07112.jpeg"),
    alt: "Trang và Kiệt cùng nhau trên phố",
    position: "50% 55%",
  },
  {
    src: asset("assets/DSC06879.jpeg"),
    alt: "Khoảnh khắc của Trang và Kiệt trong bộ ảnh cưới",
    position: "50% 60%",
  },
  {
    src: asset("assets/DSC07256.jpeg"),
    alt: "Trang và Kiệt bên nhau trong ngày cưới",
    position: "50% 58%",
  },
  {
    src: asset("assets/DSC07296.jpeg"),
    alt: "Trang và Kiệt lưu giữ khoảnh khắc ngày cưới",
    position: "50% 62%",
  },
  {
    src: asset("assets/DSC07335.jpeg"),
    alt: "Trang và Kiệt bên nhau dưới hàng cây ven sông",
    position: "50% 68%",
  },
  {
    src: asset("assets/DSC07346.jpeg"),
    alt: "Trang và Kiệt bên nhau dưới hàng cây",
    position: "50% 68%",
  },
  {
    src: asset("assets/DSC07360.jpeg"),
    alt: "Trang và Kiệt trong ánh nắng bên bờ sông",
    position: "50% 66%",
  },
  {
    src: asset("assets/DSC07371.jpeg"),
    alt: "Trang và Kiệt trong khoảnh khắc vui bên bờ sông",
    position: "50% 68%",
  },
  {
    src: asset("assets/DSC07457.jpeg"),
    alt: "Trang nhìn Kiệt giữa khung cảnh Paris",
    position: "50% 58%",
  },
  {
    src: asset("assets/DSC07486.jpeg"),
    alt: "Trang và Kiệt nắm tay nhau trong ánh chiều",
    position: "50% 68%",
  },
  {
    src: asset("assets/DSC07666.jpeg"),
    alt: "Trang và Kiệt ngồi bên nhau trước biển",
    position: "50% 70%",
  },
  {
    src: asset("assets/DSC07705.jpeg"),
    alt: "Trang và Kiệt bên nhau trước khung cửa",
    position: "50% 60%",
  },
  {
    src: asset("assets/DSC07708.jpeg"),
    alt: "Trang và Kiệt trong một khoảnh khắc bình yên",
    position: "50% 62%",
  },
  {
    src: asset("assets/DSC07788.jpeg"),
    alt: "Trang và Kiệt bên nhau trong ánh chiều bên biển",
    position: "50% 68%",
  },
];

function IllustratedDivider({ src }: { src: string }) {
  return (
    <div className="illustrated-divider" aria-hidden="true" data-reveal="scale">
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
  const [attendance, setAttendance] = useState<"yes" | "no" | "">("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const carouselTouchStartRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("cover-locked", !isInvitationOpen);
    return () => document.body.classList.remove("cover-locked");
  }, [isInvitationOpen]);

  useEffect(() => {
    if (!isInvitationOpen) return;

    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -7% 0px" },
    );

    revealItems.forEach((item) => {
      if (!item.classList.contains("is-visible")) observer.observe(item);
    });

    return () => observer.disconnect();
  }, [isInvitationOpen, submitted]);

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

  const startInvitationOpening = () => {
    setIsInvitationOpen(true);
    void audioRef.current?.play().catch(() => undefined);
  };

  const showPreviousPhoto = () => {
    setActivePhoto(
      (current) =>
        (current - 1 + carouselPhotos.length) % carouselPhotos.length,
    );
  };

  const showNextPhoto = () => {
    setActivePhoto((current) => (current + 1) % carouselPhotos.length);
  };

  const submitRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    const formData = new FormData(event.currentTarget);
    const guestName = String(formData.get("name") ?? "").trim();
    const attending = formData.get("attending");
    const guestCount =
      attending === "yes" ? Number(formData.get("guest_count") ?? 0) : 0;
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

    if (!Number.isInteger(guestCount) || guestCount < 0 || guestCount > 20) {
      setSubmitError("Vui lòng nhập số khách đi kèm từ 0 đến 20.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("rsvps").insert({
      guest_name: guestName,
      attending: attending === "yes",
      guest_count: guestCount,
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
    <main
      className={`invitation${isInvitationOpen ? " invitation--open" : ""}`}
    >
      <section
        className={`invitation-cover${isInvitationOpen ? " is-open" : ""}`}
        aria-hidden={isInvitationOpen}
      >
        <div className="invitation-cover__inner">
          <div className="cover-experience">
            <div className="cover-signature" aria-hidden="true">
              <img
                src={asset("assets/tk-date-monogram-transparent.png")}
                alt=""
              />
            </div>

            <img
              className="cover-childhood-collage"
              src={asset("assets/openingv4.png")}
              alt="Trang và Kiệt thuở nhỏ trong tranh cưới cùng chú chó"
              width="1100"
              height="1100"
              fetchPriority="high"
              decoding="async"
            />

            <button
              className="cover-open-button"
              type="button"
              onClick={startInvitationOpening}
            >
              Chạm để mở thiệp mời
            </button>
          </div>
        </div>
      </section>

      <audio
        ref={audioRef}
        src={asset("audio/baby-im-yours.mp3")}
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
          src={asset("assets/DSC07406.jpeg")}
          srcSet={`${asset("assets/DSC07406-mobile.jpeg")} 1200w, ${asset("assets/DSC07406.jpeg")} 4000w`}
          sizes="100vw"
          alt="Những khoảnh khắc trong câu chuyện của chúng mình"
          fetchPriority="low"
        />
        <div className="hero-wash" />
        <div className="hero-copy">
          <p className="save-the-date">Nhà có Hỷ</p>
          <h1>
            Trang <i>&amp;</i> Kiệt
          </h1>
          <p className="hero-note">về chung một nhà</p>
          <div className="venue-icon" aria-hidden="true">
            <img src={asset("assets/clipart-save-the-date-stamp.png")} alt="" />
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

      <section
        className="invitation-message-section"
        aria-label="Lời mời từ Trang và Kiệt"
      >
        <div className="invitation-message-frame" data-reveal="scale">
          <div className="invitation-message-copy">
            <h2 className="invitation-message-title">Lời Mời</h2>
            <p>
              Sau quãng thời gian cùng nhau trưởng thành, cùng đi qua những ngày
              vui vẻ, những thử thách và cả những điều bình dị nhất của cuộc
              sống, chúng mình quyết định sẽ nắm tay nhau bước sang một chặng
              đường mới — hành trình của hôn nhân và xây dựng gia đình nhỏ.
            </p>

            <img
              className="invitation-message-ornament"
              src={asset("assets/clipart_24.png")}
              alt=""
              aria-hidden="true"
            />

            <p>
              Trong niềm hạnh phúc đặc biệt ấy, chúng mình xin được gửi lời mời
              thân thương và trân trọng nhất đến gia đình, họ hàng, cô chú, anh
              chị em, bạn bè, đồng nghiệp cùng tất cả những người yêu quý dành
              chút thời gian đến chung vui cùng chúng mình trong ngày trọng đại.
            </p>

            <div className="invitation-families" aria-label="Gia đình hai bên">
              <div className="invitation-family invitation-family--bride">
                <strong>Quỳnh Trang</strong>
                <span>Bố Lê Thành</span>
                <span>Mẹ Thuý Quỳnh</span>
              </div>
              <div className="invitation-family invitation-family--groom">
                <strong>Tuấn Kiệt</strong>
                <span>Bố Quang Hải</span>
                <span>Mẹ Phương Mai</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ink-section">
        <div className="section-heading light" data-reveal="up">
          <span className="script-mark">Lịch trình</span>
          <h2>Ngày Hạnh Phúc</h2>
          <p>
            Cảm ơn mọi người đã trở thành một phần quan trọng trong ngày đặc
            biệt này.
          </p>
        </div>
        <div className="timeline">
          {timeline.map((item, index) => (
            <article
              className={`timeline-item${item.featured ? " is-featured" : ""}`}
              key={`${item.place}-${item.time}`}
              data-reveal={index % 2 === 0 ? "left" : "right"}
              style={{ transitionDelay: `${index * 90}ms` }}
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
                  {item.featured}
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
      <section className="paper-section welcome" id="story">
        <p className="eyebrow" data-reveal="up">
          Từ bạn học đến bạn đời
        </p>
        <IllustratedDivider src={asset("assets/clipart-cupids.png")} />
        <div className="story-grid">
          <div className="story-copy">
            <article className="story-chapter" data-reveal="up">
              <span>Hà Nội · Việt Nam</span>
              <h3>Những năm cấp 2</h3>
              <p>
                Chúng mình biết nhau từ những năm học ở trường THCS Marie Curie.
                Khi ấy chỉ là hai người cùng trường — chẳng ai nghĩ nhiều năm
                sau câu chuyện sẽ tiếp tục.
              </p>
            </article>

            <div
              className="story-interlude"
              aria-hidden="true"
              data-reveal="scale"
            >
              <img src={asset("assets/clipart_14.png")} alt="" />
            </div>

            <article className="story-chapter" data-reveal="up">
              <span>Verona · Ý</span>
              <h3>Ngày gặp lại</h3>
              <p>
                Nhiều năm sau, chúng mình bắt đầu nói chuyện lại khi một người ở
                Ý, một người ở Pháp. Từ chuyến đi Ý lần đầu của Kiệt, mọi thứ
                bắt đầu khác đi.
              </p>
            </article>

            <div
              className="story-interlude"
              aria-hidden="true"
              data-reveal="scale"
            >
              <img src={asset("assets/clipart_25.png")} alt="" />
            </div>

            <article className="story-chapter" data-reveal="up">
              <span>Pháp - Ý</span>
              <h3>Những ngày yêu xa</h3>
              <p>
                Pháp và Ý không quá xa, nhưng cũng chẳng phải gần. Những ngày
                yêu xa có những lúc không dễ dàng, nhưng cũng có rất nhiều
                chuyến bay đi rồi về, những lần gặp nhau ở những thành phố khác
                nhau, và những kỷ niệm đáng nhớ.
              </p>
            </article>

            <div
              className="story-interlude story-interlude--floral"
              aria-hidden="true"
              data-reveal="scale"
            >
              <img src={asset("assets/clipart_09.png")} alt="" />
            </div>

            <article className="story-chapter" data-reveal="up">
              <span>Hà Nội · Việt Nam</span>
              <h3>Và rồi, Hà Nội, 12 tháng 11 năm 2026</h3>
              <p>
                Từ trường cấp 2 đến Verona, từ những ngày ở hai nơi đến những
                chuyến bay đi về giữa Pháp và Ý, chúng mình đã cùng nhau đi qua
                một chặng đường dài. Và lần này, chúng mình trở về Hà Nội —
                không chỉ là một chuyến đi, mà còn vì một ngày thật đặc biệt.
              </p>
            </article>
          </div>
          <figure className="story-card taped" data-reveal="tilt">
            <img
              src={asset("assets/DSC07671.jpeg")}
              alt="Những kỷ niệm được minh họa trong hành trình bên nhau"
              loading="lazy"
            />
          </figure>
          <p className="story-closing" data-reveal="up">
            Chúng mình rất mong có sự hiện diện của những người thân thiết nhất
            trong khoảnh khắc bắt đầu ấy!
          </p>
        </div>
      </section>

      <section className="ink-section rsvp-section" id="rsvp">
        <div className="section-heading light" data-reveal="up">
          <span className="script-mark">Thân mời</span>
          <h2>Đến Chung Vui</h2>
          <p>
            Chúng mình rất mong được đón tiếp mọi khách mời chỉn chu nhất trong
            ngày đặc biệt ấy. Nếu bạn có thể sắp xếp tham dự, hãy cho chúng mình
            biết trước ngày 15/10 nhé để mọi thứ được chuẩn bị thật chu đáo cho
            buổi gặp gỡ đáng nhớ này.
          </p>
        </div>
        {submitted ? (
          <div className="success-card" data-reveal="scale">
            <h3>Chúng mình đã nhận được phản hồi!</h3>
            <p>
              Cảm ơn mọi người. <p>Hẹn gặp nhau trong ngày vui nhé!</p>
            </p>
          </div>
        ) : (
          <form className="rsvp-form" onSubmit={submitRsvp} data-reveal="up">
            <label>
              <span>Họ và tên</span>
              <input name="name" maxLength={120} autoComplete="name" required />
            </label>
            <fieldset>
              <legend>Xác nhận khách mời</legend>
              <label>
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  required
                  checked={attendance === "yes"}
                  onChange={() => setAttendance("yes")}
                />{" "}
                Mình sẽ tham dự
              </label>
              <label>
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  checked={attendance === "no"}
                  onChange={() => setAttendance("no")}
                />{" "}
                Rất tiếc, mình không thể đến
              </label>
            </fieldset>
            {attendance === "yes" && (
              <label className="rsvp-guest-count">
                <span>Số khách đi kèm</span>
                <input
                  type="number"
                  name="guest_count"
                  min={0}
                  max={20}
                  step={1}
                  defaultValue={0}
                  inputMode="numeric"
                  required
                />
                <small>Không tính chính bạn</small>
              </label>
            )}
            <label>
              <span>Lời nhắn gửi</span>
              <textarea name="message" rows={2} maxLength={1000} />
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
      <section
        className="paper-section collage-section"
        aria-label="Khoảnh khắc của Trang và Kiệt"
      >
        <div
          className="photo-carousel"
          data-reveal="scale"
          onTouchStart={(event) => {
            carouselTouchStartRef.current = event.changedTouches[0].clientX;
          }}
          onTouchEnd={(event) => {
            const start = carouselTouchStartRef.current;
            carouselTouchStartRef.current = null;
            if (start === null) return;

            const distance = event.changedTouches[0].clientX - start;
            if (Math.abs(distance) < 42) return;
            if (distance > 0) showPreviousPhoto();
            else showNextPhoto();
          }}
        >
          <span className="photo-carousel__tape" aria-hidden="true" />
          <div className="photo-carousel__viewport">
            <div
              className="photo-carousel__track"
              style={{ transform: `translateX(-${activePhoto * 100}%)` }}
            >
              {carouselPhotos.map((photo, index) => {
                const distance = Math.abs(index - activePhoto);
                const isNearby =
                  distance <= 1 || distance >= carouselPhotos.length - 1;

                return (
                  <figure
                    className="photo-carousel__slide"
                    key={photo.src}
                    aria-hidden={index !== activePhoto}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading={isNearby ? "eager" : "lazy"}
                      fetchPriority={index === activePhoto ? "high" : "low"}
                      decoding="async"
                      style={{ objectPosition: photo.position }}
                    />
                  </figure>
                );
              })}
            </div>
          </div>
          <div className="photo-carousel__footer">
            <button
              type="button"
              onClick={showPreviousPhoto}
              aria-label="Xem ảnh trước"
            >
              &#8592;
            </button>
            <img
              className="photo-carousel__heart"
              src={asset("assets/heart-transparent.png")}
              alt=""
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={showNextPhoto}
              aria-label="Xem ảnh tiếp theo"
            >
              &#8594;
            </button>
          </div>
          <span className="photo-carousel__number" aria-hidden="true">
            {String(activePhoto + 1).padStart(2, "0")} /{" "}
            {String(carouselPhotos.length).padStart(2, "0")}
          </span>
        </div>
      </section>
      <section className="paper-section countdown-section">
        <div className="line-couple" aria-hidden="true" data-reveal="scale">
          <img src={asset("assets/clipart_24.png")} alt="" />
        </div>
        <h2 data-reveal="up">Đếm ngược ngày vui!</h2>
        <div className="countdown" aria-live="polite" data-reveal="up">
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
        <details
          className="calendar-add calendar-add--countdown-section"
          data-reveal="up"
        >
          <summary>
            <span className="calendar-add__icon" aria-hidden="true">
              <img
                src={asset("assets/calendar-handdrawn-transparent.png")}
                alt=""
                loading="lazy"
              />
            </span>
            <span>
              <strong>Thêm ngày cưới vào lịch</strong>
              <small>12 · 11 · 2026</small>
            </span>
          </summary>
          <div className="calendar-add__options">
            <a href={googleCalendarUrl} target="_blank" rel="noreferrer">
              Google Calendar
            </a>
            <a
              href={asset("assets/trang-kiet-wedding.ics")}
              download="dam-cuoi-trang-kiet.ics"
            >
              Apple Calendar / Outlook
            </a>
          </div>
        </details>
        <p className="countdown-note" data-reveal="up">
          Chúng mình rất mong được gặp lại và đón tiếp mọi người!
        </p>
      </section>

      <footer data-reveal="up">
        <img
          className="footer-heart"
          src={asset("assets/footerv2.png")}
          alt="Ảnh tuổi thơ của Trang và Kiệt trong khung trái tim"
        />
        <a href="#home">Trang &amp; Kiệt</a>
        <span>12 · 11 · 2026</span>
      </footer>
    </main>
  );
}

export default App;

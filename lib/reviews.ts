/* Google reviews of Keramiksan, word for word as they appear on Google (taken from the Trustindex
   widget on keramiksan.de on 28 Sep 2026). Add new ones by hand, newest first. */

/** Shown in the summary: the rating Google displays ("Ausgezeichnet", five stars) and the review count. */
export const REVIEW_SUMMARY = { stars: 5, count: 26 };

export interface Review {
  name: string;
  date: string;   // ISO date
  stars: number;  // 1–5
  text: string;
}

export const REVIEWS: Review[] = [
  {
    name: "Fatma Durmus",
    date: "2025-02-16",
    stars: 5,
    text: "⭐⭐⭐⭐⭐ Perfekter Service und großartige Zusammenarbeit!\n\nVon der ersten Beratung bis zur finalen Umsetzung lief alles absolut professionell und reibungslos. Die individuelle Planung, die hochwertigen Materialien und die Liebe zum Detail haben mich begeistert.\n\nBesonders beeindruckt hat mich die tolle Zusammenarbeit mit Küchengaleria in Bad Kreuznach. Die Verarbeitung der Quarzoberflächen ist einfach erstklassig – sowohl optisch als auch qualitativ. Das Ergebnis ist nicht nur funktional, sondern auch ein echter Hingucker!\n\nWer eine Traumküche eine Arbeitsplatte oder bruchfeste Keramikfliesen mit höchster Qualität und perfektem Service sucht, ist hier genau richtig. Vielen Dank an das gesamte Team – ich bin rundum zufrieden!",
  },
  {
    name: "Yusuf",
    date: "2025-01-06",
    stars: 5,
    text: "Ich habe kürzlich eine Quarz Arbeitsplatte in meiner Küche installieren lassen und bin einfach sehr begeistert. Die Kommunikation war vom Beratung bis zur finalen Montage, der gesamte Prozess äußerst professionell. Das Team hat sich viel Zeit genommen, um meine Wünsche zu verstehen und mir verschiedene Optionen vorzustellen. Die Lieferung und Montage verliefen reibungslos, und die Handwerker waren freundlich, Kompetent und sehr sorgfältig in ihrer Arbeit. Das Material ist einfach Hammer und das Ergebnis ein Hingucker! Die Fahrt von etwa  1 Stunde hat sich ausgezahlt. Ich bin überaus zufrieden und kann Keramiksan wärmstens empfehlen.",
  },
  {
    name: "Ipek Aslan",
    date: "2024-08-19",
    stars: 5,
    text: "Keramiksan sayesinde harika bir Banyoya sahip olduk. Yoğun ilgi ve doğru yönlendirmeleriyle seçmek de hem yardimci oldular hem de bir müşteri olarak güzel ağırlandık. Seçilen Fayanslar bir kaç güne hemen ulaştırıldı bekleme süresi çok kısa. Gönül rahatlığıla tavsiye ediyoruz.",
  },
  {
    name: "Antonella Sferrazza",
    date: "2024-07-16",
    stars: 5,
    text: "Waren am Wochenende da, wir wurden sehr nett empfangen uns wurde gleich etwas zu trinken angeboten. Die Beratung war super, der Kauf verlief einwandfrei eine klare Empfehlung immer wieder gerne.",
  },
];

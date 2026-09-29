/* Bergstone Keramiksan: blog posts (app/blog). German is the public text, English serves the DEV
   switch. Cover photos are AI-generated (public/assets/img/blog), several around tiles and slabs
   from the catalogue. Facts about the showroom follow the rest of the site (hours, address). */
import type { Lang } from './i18n';

/** A paragraph, a subheading, a bulleted list or a highlighted tip. */
export type Block = { p: string } | { h: string } | { list: string[] } | { tip: string };

export interface PostCopy {
  title: string;
  excerpt: string;
  category: string;
  /** Describes the cover photo. */
  alt: string;
  body: Block[];
  /** Label of the link to the matching range or service at the end of the post. */
  cta: string;
}

export interface Post {
  slug: string;
  /** Cover photo, 3:2. */
  image: string;
  /** Where the closing link leads. */
  href: string;
  de: PostCopy;
  en: PostCopy;
}

const NB = ' '; // keeps "60 × 120 cm" on one line

export const POSTS: Post[] = [
  {
    slug: 'grossformatige-fliesen',
    image: '/assets/img/blog/grossformate.jpg',
    href: '/fliesen?art=grossformate',
    de: {
      title: 'Großformatige Fliesen: Was Sie vor der Verlegung wissen sollten',
      excerpt: `60${NB}×${NB}120 oder 120${NB}×${NB}120${NB}cm: Große Formate wirken ruhig und großzügig. Damit das Ergebnis überzeugt, kommt es auf Untergrund, Aufteilung und Verlegetechnik an.`,
      category: 'Planung',
      alt: 'Wohnraum mit großformatigen Fliesen in heller Marmoroptik an Boden und Wand',
      body: [
        { p: 'Großformatige Fliesen gehören zu den häufigsten Wünschen in unserer Beratung. Wenige Fugen lassen Räume ruhiger und größer wirken, und die Flächen sind leichter zu reinigen. Gleichzeitig verzeihen große Formate weniger als kleine: Jede Unebenheit im Untergrund und jede ungünstige Aufteilung fällt auf. Mit guter Planung vermeiden Sie das.' },
        { h: 'Ab wann spricht man von Großformat?' },
        { p: `Eine feste Grenze gibt es nicht. Üblich ist, Fliesen ab etwa 60${NB}×${NB}60${NB}cm als großformatig zu bezeichnen. Formate wie 60${NB}×${NB}120, 80${NB}×${NB}80 oder 120${NB}×${NB}120${NB}cm sind heute im Wohnbereich und im Bad verbreitet, dazu kommen noch größere Platten für Wände und Möbelflächen.` },
        { h: 'Der Untergrund entscheidet' },
        { p: 'Je größer die Fliese, desto ebener muss der Untergrund sein. Kleine Fliesen gleichen Unebenheiten im Kleberbett aus, eine 120 cm lange Platte liegt dagegen hohl, wenn der Estrich nicht plan ist. Hohlstellen können später zu Brüchen führen. Deshalb wird der Untergrund vor der Verlegung geprüft und bei Bedarf gespachtelt oder ausgeglichen.' },
        { list: [
          'Ebenheit mit einer langen Richtlatte prüfen, nicht nur mit der Wasserwaage',
          'Den Estrich ausreichend trocknen lassen, bevor verlegt wird',
          'Bewegungsfugen des Gebäudes übernehmen und mit einplanen',
        ] },
        { h: 'Die Aufteilung vorher festlegen' },
        { p: 'Bei großen Formaten fallen schmale Randstücke besonders auf. Legen Sie deshalb vorab fest, wo die erste Reihe beginnt, wie die Fugen zu Türen, Fenstern und Möbeln laufen und wo geschnitten wird. Im Bad lohnt es sich, Wand und Boden gemeinsam zu planen, damit die Fugen durchlaufen.' },
        { h: 'Vollflächig verlegen, mit Nivelliersystem' },
        { p: 'Große Fliesen werden meist im kombinierten Verfahren verlegt: Der Kleber kommt auf den Untergrund und zusätzlich auf die Rückseite der Fliese (Buttering-Floating). So entsteht ein möglichst hohlraumfreies Kleberbett. Nivelliersysteme mit Laschen und Keilen halten benachbarte Fliesen auf einer Höhe und verhindern Überzähne an den Kanten. Für Transport und Einbau sind Saugheber und zwei Personen Pflicht.' },
        { h: 'Schmale Fugen, aber nie fugenlos' },
        { p: 'Rektifizierte Fliesen haben exakt geschliffene Kanten und erlauben Fugen von wenigen Millimetern. Ganz ohne Fuge wird nicht verlegt: Die Fuge gleicht Maßtoleranzen aus und nimmt Spannungen auf. Eine Fugenfarbe nahe am Fliesenton lässt die Fläche besonders ruhig wirken.' },
        { tip: 'Bringen Sie zur Beratung einen Grundriss oder ein paar Fotos mit. Dann prüfen wir gemeinsam, welches Format zu Ihrem Raum passt und wie die Aufteilung aussehen kann.' },
      ],
      cta: 'Großformate ansehen',
    },
    en: {
      title: 'Large-format tiles: what to know before they are laid',
      excerpt: `60${NB}×${NB}120 or 120${NB}×${NB}120${NB}cm: large formats look calm and generous. For a convincing result, the substrate, the layout and the laying technique matter.`,
      category: 'Planning',
      alt: 'Living room with large-format light marble-look tiles on the floor and a wall',
      body: [
        { p: 'Large-format tiles are among the most frequent requests in our consultations. Fewer joints make rooms look calmer and larger, and the surfaces are easier to clean. At the same time, large formats are less forgiving than small ones: every unevenness in the substrate and every awkward layout shows. Good planning avoids that.' },
        { h: 'When is a tile large format?' },
        { p: `There is no fixed limit. Tiles from about 60${NB}×${NB}60${NB}cm are usually called large format. Sizes such as 60${NB}×${NB}120, 80${NB}×${NB}80 or 120${NB}×${NB}120${NB}cm are now common in living areas and bathrooms, alongside even larger slabs for walls and furniture.` },
        { h: 'The substrate decides' },
        { p: 'The larger the tile, the flatter the substrate has to be. Small tiles even out unevenness in the adhesive bed, whereas a 120 cm slab sits hollow if the screed is not flat. Hollow spots can later lead to cracks. That is why the substrate is checked before laying and levelled where needed.' },
        { list: [
          'Check flatness with a long straightedge, not just a spirit level',
          'Let the screed dry properly before laying',
          "Take over the building's movement joints and plan for them",
        ] },
        { h: 'Fix the layout in advance' },
        { p: 'With large formats, narrow cut pieces at the edges stand out. So decide in advance where the first row starts, how the joints run in relation to doors, windows and furniture, and where tiles will be cut. In bathrooms it pays to plan wall and floor together so that the joints line up.' },
        { h: 'Full coverage and a levelling system' },
        { p: 'Large tiles are usually laid with the combined method: adhesive goes on the substrate and also on the back of the tile (buttering-floating). This creates an adhesive bed with as few voids as possible. Levelling systems with clips and wedges keep neighbouring tiles at the same height and prevent lippage at the edges. Suction lifters and two people are a must for handling and installation.' },
        { h: 'Narrow joints, but never jointless' },
        { p: 'Rectified tiles have precisely ground edges and allow joints of just a few millimetres. Tiles are never laid entirely without joints: the joint absorbs size tolerances and stresses. A grout colour close to the tile shade makes the surface look particularly calm.' },
        { tip: 'Bring a floor plan or a few photos to your consultation. Then we can check together which format suits your room and what the layout could look like.' },
      ],
      cta: 'View large formats',
    },
  },
  {
    slug: 'arbeitsplatten-quarz-keramik-naturstein',
    image: '/assets/img/blog/arbeitsplatten.jpg',
    href: '/fliesen?art=kueche',
    de: {
      title: 'Quarz, Keramik oder Naturstein: Welche Arbeitsplatte passt zu Ihnen?',
      excerpt: 'Alle drei Materialien sind robust und schön, unterscheiden sich aber bei Hitze, Flecken, Pflege und Optik. Ein Überblick für Ihre Entscheidung.',
      category: 'Küche',
      alt: 'Muster von Quarz, Keramik und Naturstein nebeneinander auf einer Kücheninsel',
      body: [
        { p: 'Die Arbeitsplatte ist die am stärksten beanspruchte Fläche in der Küche. Geschnitten, abgestellt, verschüttet: Sie muss einiges aushalten und soll trotzdem über Jahre gut aussehen. In unserem Sortiment finden Sie Arbeitsplatten aus Quarz, Keramik und Naturstein. Welches Material zu Ihnen passt, hängt davon ab, wie Sie kochen und was Ihnen bei der Optik wichtig ist.' },
        { h: 'Quarz: pflegeleicht und gleichmäßig' },
        { p: 'Quarzplatten bestehen überwiegend aus gemahlenem Quarz, der mit Harz gebunden wird. Die Oberfläche ist dicht, nimmt kaum Flüssigkeit auf und ist dadurch unempfindlich gegen Flecken. Farben und Muster fallen sehr gleichmäßig aus, von reinem Weiß bis zur Marmoroptik. Heiße Töpfe sollten Sie nicht direkt abstellen: Das Harz verträgt große Hitze schlecht, ein Untersetzer schützt.' },
        { h: 'Keramik: hitzefest und kratzbeständig' },
        { p: 'Keramische Arbeitsplatten werden aus Tonmineralien bei sehr hohen Temperaturen gebrannt. Sie sind hitzebeständig, sehr kratzfest und lichtecht und nehmen praktisch nichts auf. Möglich sind dünne Stärken und fast jede Optik, von Beton bis Marmor. Die Kanten sind härter als bei Quarz, aber auch spröder: Ein harter Schlag auf die Kante kann zu einer Abplatzung führen.' },
        { h: 'Naturstein: jede Platte ein Unikat' },
        { p: 'Naturstein wie Granit, Quarzit oder Marmor ist über Jahrmillionen entstanden. Jede Platte hat ihre eigene Zeichnung, keine gleicht der anderen. Granit und Quarzit sind sehr hart und hitzebeständig. Marmor ist weicher und reagiert empfindlich auf Säuren wie Zitronensaft oder Essig. Naturstein wird imprägniert, damit er weniger Flüssigkeit aufnimmt; je nach Stein wird das in gewissen Abständen wiederholt.' },
        { h: 'Maß, Stärke und Ausschnitte' },
        { p: 'Arbeitsplatten werden nach Maß gefertigt, mit Ausschnitten für Spüle und Kochfeld und der passenden Kante. Dünne Platten wirken leicht und modern, stärkere Platten eher massiv. Eine Spüle kann flächenbündig eingelassen oder von unten montiert werden. Genau gemessen wird meist erst, wenn die Unterschränke stehen: So passt die Platte auch an Wänden, die nicht ganz gerade sind.' },
        { h: 'Auf einen Blick' },
        { list: [
          'Quarz: sehr fleckunempfindlich, gleichmäßige Optik, Untersetzer für heiße Töpfe',
          'Keramik: hitze- und kratzfest, lichtecht, Kanten vor harten Schlägen schützen',
          'Naturstein: einzigartige Maserung, je nach Stein hitzebeständig, regelmäßig imprägnieren',
        ] },
        { tip: 'Suchen Sie Ihre Natursteinplatte am besten selbst aus. Eine Auswahl unserer Platten sehen Sie online, ihre volle Wirkung zeigt sich aber erst vor Ort.' },
      ],
      cta: 'Arbeitsplatten ansehen',
    },
    en: {
      title: 'Quartz, ceramic or natural stone: which worktop suits you?',
      excerpt: 'All three materials are hard-wearing and beautiful, but they differ in heat resistance, stains, care and look. An overview to help you decide.',
      category: 'Kitchen',
      alt: 'Quartz, ceramic and natural stone samples side by side on a kitchen island',
      body: [
        { p: 'The worktop is the hardest-working surface in the kitchen. Things are cut, put down and spilled on it: it has to take a lot and still look good for years. Our range includes worktops in quartz, ceramic and natural stone. Which material suits you depends on how you cook and what matters to you visually.' },
        { h: 'Quartz: easy care and even' },
        { p: 'Quartz worktops consist mainly of ground quartz bound with resin. The surface is dense and absorbs hardly any liquid, which makes it resistant to stains. Colours and patterns are very even, from pure white to a marble look. Do not put hot pans directly on it: the resin does not cope well with high heat, so use a trivet.' },
        { h: 'Ceramic: heat-proof and scratch-resistant' },
        { p: 'Ceramic worktops are made from clay minerals fired at very high temperatures. They are heat-resistant, very scratch-resistant and lightfast, and absorb practically nothing. Thin slabs and almost any look are possible, from concrete to marble. The edges are harder than quartz but also more brittle: a hard knock on an edge can chip it.' },
        { h: 'Natural stone: every slab is unique' },
        { p: 'Natural stone such as granite, quartzite or marble formed over millions of years. Every slab has its own pattern, and no two are alike. Granite and quartzite are very hard and heat-resistant. Marble is softer and sensitive to acids such as lemon juice or vinegar. Natural stone is sealed so that it absorbs less liquid; depending on the stone, this is repeated at intervals.' },
        { h: 'Size, thickness and cut-outs' },
        { p: 'Worktops are made to measure, with cut-outs for the sink and hob and a suitable edge. Thin slabs look light and modern, thicker ones more solid. A sink can be set flush or mounted from below. The exact measurements are usually taken once the base units are in place: that way the worktop also fits walls that are not perfectly straight.' },
        { h: 'At a glance' },
        { list: [
          'Quartz: highly stain-resistant, even look, use trivets for hot pans',
          'Ceramic: heat- and scratch-resistant, lightfast, protect the edges from hard knocks',
          'Natural stone: unique veining, heat-resistant depending on the stone, seal regularly',
        ] },
        { tip: 'Choose your natural stone slab in person if you can. You can see a selection of our slabs online, but their full effect only shows on site.' },
      ],
      cta: 'View worktops',
    },
  },
  {
    slug: 'fliesen-oberflaechen-matt-glaenzend',
    image: '/assets/img/blog/oberflaechen.jpg',
    href: '/fliesen',
    de: {
      title: 'Matt, glänzend oder poliert? Fliesenoberflächen im Vergleich',
      excerpt: 'Dieselbe Fliese kann matt ganz ruhig und poliert fast wie ein Spiegel wirken. Worauf es bei der Wahl der Oberfläche ankommt.',
      category: 'Material',
      alt: 'Zwei Fliesenmuster in beiger Marmoroptik, links matt, rechts hochglänzend mit Spiegelung',
      body: [
        { p: 'Neben Farbe und Format bestimmt die Oberfläche, wie eine Fliese wirkt. In unserem Sortiment finden Sie matte, glänzende und hochglänzende Fliesen, dazu strukturierte Carving-Oberflächen und polierte Natursteinplatten. Jede Oberfläche hat ihre Stärken, und nicht jede passt an jeden Ort.' },
        { h: 'Matt: ruhig und alltagstauglich' },
        { p: 'Matte Fliesen spiegeln kaum. Sie wirken ruhig und natürlich, ähnlich wie gewachsener Stein. Kalkflecken, Wasserränder und Streifen fallen auf matten Flächen weniger auf. Matte Oberflächen sind häufig auch rutschhemmender und deshalb eine gute Wahl für Böden, vor allem im Bad und im Eingangsbereich.' },
        { h: 'Glänzend und Hochglanz: Licht und Tiefe' },
        { p: 'Glänzende Fliesen reflektieren das Licht und lassen Räume heller und größer wirken. Bei Marmoroptiken bringt der Glanz die Maserung zur Geltung und erzeugt Tiefe. Auf dem Boden gilt: Nass sind glänzende Flächen glatter, und Staub, Fußspuren oder Streifen sieht man im Gegenlicht eher. An Wänden, etwa im Bad oder als Küchenrückwand, spielen Hochglanzfliesen ihre Stärken voll aus.' },
        { h: 'Poliert: tiefer Glanz' },
        { p: 'Polierte Oberflächen entstehen durch Schleifen und Polieren, bei Feinsteinzeug ebenso wie bei Naturstein. Sie haben einen tiefen, spiegelnden Glanz und wirken besonders edel. Beim Polieren öffnen sich feine Poren an der Oberfläche; polierte Fliesen und Platten werden deshalb häufig imprägniert, damit Flecken nicht eindringen. Fragen Sie bei der Auswahl nach, wie die jeweilige Oberfläche behandelt ist.' },
        { h: 'Carving: Struktur zum Anfassen' },
        { p: 'Carving-Oberflächen haben eine leichte Struktur, die das Dekor plastischer macht. Je nach Lichteinfall entstehen feine Schatten und Glanzpunkte. Die Fliese wirkt dadurch lebendiger als eine glatte Fläche.' },
        { h: 'So finden Sie die passende Oberfläche' },
        { list: [
          'Böden in Bad, Flur und Küche: eher matt oder mit rutschhemmender Oberfläche',
          'Wände und Rückwände: glänzend oder hochglänzend für Licht und Tiefe',
          'Viel Tageslicht und Gegenlicht: matte Flächen verzeihen mehr',
          'Kleine, dunkle Räume: Glanz hellt optisch auf',
        ] },
        { tip: 'Schauen Sie sich Muster immer bei Tageslicht und bei Ihrem Kunstlicht an. Im Showroom vergleichen Sie Oberflächen direkt nebeneinander.' },
      ],
      cta: 'Alle Fliesen ansehen',
    },
    en: {
      title: 'Matt, glossy or polished? Tile finishes compared',
      excerpt: 'The same tile can look completely calm in matt and almost like a mirror when polished. What to consider when choosing a finish.',
      category: 'Materials',
      alt: 'Two beige marble-look tile samples, matt on the left and high-gloss with reflections on the right',
      body: [
        { p: 'Alongside colour and format, the surface decides how a tile looks. Our range includes matt, glossy and high-gloss tiles, as well as textured carving finishes and polished natural stone slabs. Each finish has its strengths, and not every one suits every place.' },
        { h: 'Matt: calm and practical' },
        { p: 'Matt tiles hardly reflect. They look calm and natural, much like natural stone. Limescale, water marks and streaks show less on matt surfaces. Matt finishes are often more slip-resistant too, which makes them a good choice for floors, especially in bathrooms and entrance areas.' },
        { h: 'Glossy and high-gloss: light and depth' },
        { p: 'Glossy tiles reflect light and make rooms look brighter and larger. With marble looks, the shine brings out the veining and creates depth. On floors, bear in mind that glossy surfaces are more slippery when wet, and dust, footprints or streaks show more easily against the light. On walls, for example in bathrooms or as a kitchen splashback, high-gloss tiles play to their strengths.' },
        { h: 'Polished: deep shine' },
        { p: 'Polished surfaces are created by grinding and polishing, on porcelain stoneware as well as on natural stone. They have a deep, mirror-like shine and look particularly refined. Polishing opens fine pores in the surface, which is why polished tiles and slabs are often sealed so that stains cannot penetrate. When choosing, ask how the surface in question has been treated.' },
        { h: 'Carving: texture you can feel' },
        { p: 'Carving finishes have a slight texture that makes the pattern more three-dimensional. Depending on the light, fine shadows and highlights appear. This makes the tile look livelier than a smooth surface.' },
        { h: 'How to find the right finish' },
        { list: [
          'Floors in bathrooms, hallways and kitchens: matt or with a slip-resistant surface',
          'Walls and splashbacks: glossy or high-gloss for light and depth',
          'Lots of daylight and backlight: matt surfaces are more forgiving',
          'Small, dark rooms: gloss brightens them visually',
        ] },
        { tip: 'Always look at samples in daylight and under your own artificial light. In the showroom you can compare finishes side by side.' },
      ],
      cta: 'View all tiles',
    },
  },
  {
    slug: 'badfliesen-auswaehlen',
    image: '/assets/img/blog/badfliesen.jpg',
    href: '/fliesen?art=wandfliesen',
    de: {
      title: 'Fliesen fürs Bad: So treffen Sie die richtige Wahl',
      excerpt: 'Rutschhemmung, Format, Fugen und Pflege: Im Bad muss eine Fliese mehr können als gut aussehen. Worauf Sie achten sollten.',
      category: 'Bad',
      alt: 'Modernes Bad mit bodengleicher Dusche, Wandfliesen in dunkelgrauer Marmoroptik und Waschtisch aus Holz',
      body: [
        { p: 'Im Bad sind Fliesen jeden Tag Wasser, Dampf und Reinigungsmitteln ausgesetzt. Gleichzeitig prägen sie die Atmosphäre des Raums wie kaum ein anderes Material. Mit ein paar Grundregeln finden Sie Fliesen, die schön aussehen und lange Freude machen.' },
        { h: 'Sicher auf nassem Boden' },
        { p: 'Für den Boden ist die Rutschhemmung entscheidend. Sie wird in Bewertungsgruppen angegeben: R9 bis R13 für Bereiche, die mit Schuhen betreten werden, und A, B und C für Barfußbereiche. Im privaten Bad ist R10 für den Boden verbreitet. In der bodengleichen Dusche empfiehlt sich eine höhere Rutschhemmung, zum Beispiel R10 mit Barfußklasse B oder R11. Kleinere Formate in der Dusche geben durch die zusätzlichen Fugen mehr Halt.' },
        { h: 'Große Formate an der Wand' },
        { p: 'Großformatige Wandfliesen bedeuten weniger Fugen und damit weniger Reinigungsaufwand. In der Dusche wirken sie besonders elegant, etwa in Marmoroptik. Wichtig ist eine sorgfältige Abdichtung unter den Fliesen: Sie schützt die Wand dauerhaft vor Feuchtigkeit.' },
        { h: 'Wandfliese oder Bodenfliese?' },
        { p: 'Nicht jede Fliese eignet sich für jeden Einsatz. Klassische Wandfliesen aus Steingut sind leichter und saugfähiger und gehören nur an die Wand. Feinsteinzeug ist dicht, sehr belastbar und frostsicher und kann an Wand und Boden verlegt werden. So lassen sich Boden und Wand auch mit derselben Fliese gestalten, was besonders ruhig wirkt.' },
        { h: 'Fugen und Silikon' },
        { p: 'Zementäre Fugen sind für die meisten Bäder geeignet. In stark beanspruchten Bereichen können Epoxidharzfugen sinnvoll sein, weil sie besonders dicht und leicht zu reinigen sind. Die Silikonfugen in den Ecken und am Übergang zu Wanne oder Duschtasse sind Wartungsfugen: Kontrollieren Sie sie regelmäßig und lassen Sie sie bei Bedarf erneuern.' },
        { h: 'Farbe und Licht' },
        { list: [
          'Helle Töne lassen kleine Bäder größer wirken',
          'Dunkle Akzente, etwa eine Duschwand, geben Tiefe',
          'Warme Beige- und Holzoptiken schaffen Wohnlichkeit',
          'Glanz an der Wand und matte Fliesen am Boden sind eine bewährte Kombination',
        ] },
        { tip: 'Planen Sie Boden- und Wandfliesen zusammen und achten Sie darauf, dass die Fugen durchlaufen. Das wirkt ruhiger und hochwertiger.' },
      ],
      cta: 'Wandfliesen ansehen',
    },
    en: {
      title: 'Bathroom tiles: how to make the right choice',
      excerpt: 'Slip resistance, format, joints and care: in the bathroom a tile has to do more than look good. What to look out for.',
      category: 'Bathroom',
      alt: 'Modern bathroom with a level-access shower, dark grey marble-look wall tiles and a wooden vanity',
      body: [
        { p: 'In the bathroom, tiles face water, steam and cleaning products every day. At the same time, they shape the atmosphere of the room like hardly any other material. With a few basic rules you will find tiles that look beautiful and give lasting pleasure.' },
        { h: 'Safe on wet floors' },
        { p: 'For the floor, slip resistance is decisive. In Germany it is given in rating groups: R9 to R13 for areas walked on in shoes, and A, B and C for barefoot areas. R10 is common for floors in private bathrooms. A higher slip resistance is advisable in a level-access shower, for example R10 with barefoot class B, or R11. Smaller formats in the shower add grip through the extra joints.' },
        { h: 'Large formats on the wall' },
        { p: 'Large-format wall tiles mean fewer joints and therefore less cleaning. They look particularly elegant in the shower, for example in a marble look. Careful waterproofing under the tiles is essential: it protects the wall from moisture for the long term.' },
        { h: 'Wall tile or floor tile?' },
        { p: 'Not every tile suits every use. Classic ceramic wall tiles are lighter and more absorbent and belong on the wall only. Porcelain stoneware is dense, very hard-wearing and frost-resistant and can be laid on walls and floors. This lets you design floor and walls with the same tile, which looks particularly calm.' },
        { h: 'Joints and silicone' },
        { p: 'Cement-based grout suits most bathrooms. In heavily used areas, epoxy grout can make sense because it is particularly dense and easy to clean. The silicone joints in the corners and where the tiles meet the bath or shower tray are maintenance joints: check them regularly and have them renewed when necessary.' },
        { h: 'Colour and light' },
        { list: [
          'Light shades make small bathrooms look larger',
          'Dark accents, such as a shower wall, add depth',
          'Warm beige and wood looks create a homely feel',
          'Gloss on the walls and matt tiles on the floor is a proven combination',
        ] },
        { tip: 'Plan floor and wall tiles together and make sure the joints line up. It looks calmer and more refined.' },
      ],
      cta: 'View wall tiles',
    },
  },
  {
    slug: 'fliesen-reinigen-und-pflegen',
    image: '/assets/img/blog/pflege.jpg',
    href: '/reparaturen',
    de: {
      title: 'Fliesen richtig reinigen und pflegen',
      excerpt: 'Mit dem richtigen Reiniger bleiben Fliesen, Fugen und Naturstein über Jahre schön. Was Sie im Alltag beachten sollten und was Sie besser vermeiden.',
      category: 'Pflege',
      alt: 'Wischmopp, Eimer und Sprühflasche auf einem großformatigen Fliesenboden in hellem Grau',
      body: [
        { p: 'Feinsteinzeug gehört zu den pflegeleichtesten Oberflächen im Haus. Mit ein paar einfachen Regeln bleiben Fliesen und Fugen lange wie neu, und auch Naturstein behält seinen Glanz.' },
        { h: 'Die tägliche Reinigung' },
        { p: 'Für die regelmäßige Reinigung genügen warmes Wasser und ein pH-neutraler Reiniger. Arbeiten Sie mit einem Mikrofasertuch oder Wischmopp und wischen Sie glänzende Fliesen mit klarem Wasser nach. So vermeiden Sie Schlieren.' },
        { list: [
          'pH-neutralen Reiniger sparsam dosieren: Zu viel Reiniger hinterlässt einen Film',
          'Keine Scheuermittel oder kratzenden Schwämme auf polierten und glänzenden Flächen',
          'Keine Pflegemittel mit Wachs oder Öl auf Feinsteinzeug: Sie machen die Oberfläche stumpf und rutschig',
        ] },
        { h: 'Fugen sauber halten' },
        { p: 'Zementäre Fugen sind offenporig und nehmen Schmutz leichter auf als die Fliese. Reinigen Sie sie regelmäßig mit einem pH-neutralen Mittel und einer weichen Bürste. Säurehaltige Reiniger greifen zementäre Fugen auf Dauer an; setzen Sie sie nur gezielt ein, etwa gegen Kalk, und spülen Sie gründlich nach.' },
        { h: 'Kalk im Bad vorbeugen' },
        { p: 'In der Dusche entstehen Kalkflecken, wenn Wasser auf Fliesen und Glas eintrocknet. Ziehen Sie Wände und Glas nach dem Duschen kurz mit einem Abzieher ab und lüften Sie gut. Das dauert nur einen Moment und erspart Ihnen später kräftige Kalkreiniger.' },
        { h: 'Naturstein braucht besondere Pflege' },
        { p: 'Marmor und Kalkstein reagieren empfindlich auf Säure. Essigreiniger, Zitronensaft oder Entkalker können matte Flecken hinterlassen. Verwenden Sie spezielle Natursteinreiniger und wischen Sie Verschüttetes möglichst schnell auf. Eine Imprägnierung macht den Stein weniger saugfähig; wie oft sie erneuert wird, hängt vom Stein und von der Beanspruchung ab.' },
        { h: 'Nach der Verlegung: Zementschleier entfernen' },
        { p: 'Nach dem Verfugen bleibt oft ein feiner grauer Film auf den Fliesen zurück, der Zementschleier. Er lässt sich mit einem Zementschleierentferner beseitigen. Säureempfindliche Oberflächen wie Marmor brauchen ein säurefreies Produkt; testen Sie jedes Mittel zuerst an einer unauffälligen Stelle.' },
        { tip: 'Unsicher, welcher Reiniger zu Ihrer Fliese passt? Schicken Sie uns ein Foto per WhatsApp, wir helfen Ihnen gern weiter.' },
      ],
      cta: 'Fugen oder Fliesen erneuern lassen',
    },
    en: {
      title: 'Cleaning and caring for tiles properly',
      excerpt: 'With the right cleaner, tiles, joints and natural stone stay beautiful for years. What to keep in mind day to day, and what to avoid.',
      category: 'Care',
      alt: 'Mop, bucket and spray bottle on a light grey large-format tile floor',
      body: [
        { p: 'Porcelain stoneware is one of the easiest surfaces to care for in the home. With a few simple rules, tiles and joints stay like new for a long time, and natural stone keeps its shine.' },
        { h: 'Everyday cleaning' },
        { p: 'For regular cleaning, warm water and a pH-neutral cleaner are enough. Use a microfibre cloth or mop and wipe glossy tiles again with clear water. This avoids streaks.' },
        { list: [
          'Dose pH-neutral cleaner sparingly: too much leaves a film',
          'No abrasive products or scouring sponges on polished and glossy surfaces',
          'No care products containing wax or oil on porcelain stoneware: they make the surface dull and slippery',
        ] },
        { h: 'Keeping joints clean' },
        { p: 'Cement-based joints are porous and pick up dirt more easily than the tile. Clean them regularly with a pH-neutral product and a soft brush. Acidic cleaners attack cement-based joints over time; use them only where needed, for example against limescale, and rinse thoroughly.' },
        { h: 'Preventing limescale in the bathroom' },
        { p: 'In the shower, limescale marks form when water dries on the tiles and glass. After showering, quickly wipe the walls and glass with a squeegee and ventilate well. It only takes a moment and saves you strong limescale removers later.' },
        { h: 'Natural stone needs special care' },
        { p: 'Marble and limestone are sensitive to acid. Vinegar cleaners, lemon juice or descalers can leave dull marks. Use special natural stone cleaners and wipe up spills as quickly as possible. Sealing makes the stone less absorbent; how often it is renewed depends on the stone and how heavily it is used.' },
        { h: 'After laying: removing cement haze' },
        { p: 'After grouting, a fine grey film often remains on the tiles: the cement haze. It can be removed with a cement haze remover. Acid-sensitive surfaces such as marble need an acid-free product; test every product on an inconspicuous spot first.' },
        { tip: 'Not sure which cleaner suits your tile? Send us a photo on WhatsApp and we will be happy to help.' },
      ],
      cta: 'Have joints or tiles renewed',
    },
  },
  {
    slug: 'showroom-besuch-vorbereiten',
    image: '/assets/img/blog/showroom-besuch.jpg',
    href: '/beratung',
    de: {
      title: 'Ihr Besuch im Showroom: So bereiten Sie sich vor',
      excerpt: 'Mit Fotos, groben Maßen und ein paar Ideen im Gepäck wird die Beratung besonders ergiebig. Eine kleine Checkliste für Ihren Besuch in Ludwigshafen.',
      category: 'Beratung',
      alt: 'Ein Paar betrachtet großformatige Stein- und Marmorplatten in einem Fliesen-Showroom',
      body: [
        { p: 'Fliesen wirken erst richtig, wenn man sie sieht und fühlt. Deshalb lohnt sich ein Besuch in unserem Showroom in der Notwendestraße 2 in Ludwigshafen. Mit etwas Vorbereitung holen Sie das Meiste aus der Beratung heraus.' },
        { h: 'Was Sie mitbringen sollten' },
        { list: [
          'Fotos des Raums, gern aus mehreren Blickwinkeln',
          'Grobe Maße oder einen Grundriss',
          'Bilder von Fliesen, Bädern oder Küchen, die Ihnen gefallen',
          'Muster von Möbeln, Armaturen oder Wandfarben, falls schon vorhanden',
          'Eine Vorstellung von Budget und Zeitplan',
        ] },
        { h: 'Mit Termin oder spontan?' },
        { p: 'Sie können während der Öffnungszeiten einfach vorbeikommen: Mo–Fr 08:00–18:00 und Sa 09:00–16:00. Für eine ausführliche Beratung vereinbaren Sie am besten vorab einen Termin per WhatsApp oder Telefon. Dann nehmen wir uns gezielt Zeit für Sie. Wir beraten auf Deutsch, Türkisch und Englisch.' },
        { h: 'Vor Ort: vergleichen statt raten' },
        { p: 'Im Showroom sehen Sie Wand- und Bodenfliesen, Großformate, Steinplatten und Arbeitsplatten direkt nebeneinander. So erkennen Sie, welche Farben, Formate und Oberflächen zusammenpassen. Achten Sie dabei auch auf das Licht: Eine Fliese wirkt bei Tageslicht anders als unter warmem Kunstlicht.' },
        { h: 'Schon vorab umsehen' },
        { p: 'Wenn Sie möchten, sehen Sie sich schon vor Ihrem Besuch im 360°-Rundgang um und blättern in unseren Katalogen. So wissen Sie bereits, welche Bereiche Sie sich genauer anschauen wollen.' },
        { h: 'Nach der Beratung' },
        { p: 'Wenn Sie sich entschieden haben, erhalten Sie ein Angebot für das Material. Auf Wunsch kommen wir zum Aufmaß zu Ihnen und übernehmen Lieferung und Verlegung, sodass Sie alles aus einer Hand bekommen.' },
        { tip: 'Fotografieren Sie Ihre Favoriten im Showroom. So können Sie zu Hause in Ruhe vergleichen und die Bilder beim nächsten Gespräch zeigen.' },
      ],
      cta: 'Mehr zur Beratung',
    },
    en: {
      title: 'Your visit to the showroom: how to prepare',
      excerpt: 'With photos, rough measurements and a few ideas, your consultation will be particularly productive. A short checklist for your visit to Ludwigshafen.',
      category: 'Advice',
      alt: 'A couple looking at large-format stone and marble slabs in a tile showroom',
      body: [
        { p: 'Tiles only really come alive when you can see and touch them. That is why a visit to our showroom at Notwendestraße 2 in Ludwigshafen is worthwhile. With a little preparation you will get the most out of your consultation.' },
        { h: 'What to bring' },
        { list: [
          'Photos of the room, ideally from several angles',
          'Rough measurements or a floor plan',
          'Pictures of tiles, bathrooms or kitchens you like',
          'Samples of furniture, fittings or wall colours, if you already have them',
          'An idea of your budget and timeline',
        ] },
        { h: 'Appointment or drop-in?' },
        { p: "You are welcome to drop by during opening hours: Mon–Fri 8:00–18:00 and Sat 9:00–16:00. For an in-depth consultation it's best to book an appointment via WhatsApp or phone beforehand. Then we can set aside time for you. We advise in German, Turkish and English." },
        { h: 'On site: compare instead of guessing' },
        { p: 'In the showroom you see wall and floor tiles, large formats, stone slabs and worktops side by side. This shows you which colours, formats and finishes go together. Pay attention to the light as well: a tile looks different in daylight than under warm artificial light.' },
        { h: 'Look around in advance' },
        { p: 'If you like, look around in the 360° tour and browse our catalogues before your visit. That way you already know which areas you want to take a closer look at.' },
        { h: 'After the consultation' },
        { p: 'Once you have decided, you receive a quote for the material. On request we come to you to take measurements and handle delivery and installation, so you get everything from one team.' },
        { tip: 'Take photos of your favourites in the showroom. That way you can compare them calmly at home and show the pictures at your next appointment.' },
      ],
      cta: 'More about our advice',
    },
  },
];

export const postBySlug = (slug: string) => POSTS.find((post) => post.slug === slug);

export const postCopy = (post: Post, lang: Lang) => post[lang];

const blockText = (block: Block) => ('p' in block ? block.p : 'h' in block ? block.h : 'tip' in block ? block.tip : block.list.join(' '));

/** Minutes to read at about 200 words a minute, rounded up. */
export const readingMinutes = (copy: PostCopy) =>
  Math.max(1, Math.ceil(copy.body.map(blockText).join(' ').split(/\s+/).length / 200));

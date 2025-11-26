import styles from './About.module.css'
import { imageAbout } from './About.module.css'

function About() {
    return (
        <div className={styles.about}>
            <div className={imageAbout}>
            </div>

            <div className={styles.textAbout}>
                <h2>Sobre a gente</h2>
                <p>Lorem Ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into.</p>
                <p>Lorem Ipsum simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into.</p>
            </div>
        </div>
    )
}

export default About;
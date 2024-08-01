import styles from './Nutrition.module.css'

function Nutrition() {
    return (
        <>
        <div className={styles.text}>
        <h1>Everything you need to know about Nutrition</h1>
        <h3>Here you will find information about quick and healthy recipes,
            a lot of information about superfoods and much more.
            Feel free to Post, share and like !
        </h3>
        </div>
        <div  className={styles.section}>
            <img src="/nutrition.webp" alt="Nutrition picture" className={styles.image}/>
            <img src="/food-health.jpg" alt="Food picture" className={styles.image} />

        </div>
        </>
    )
}

export default Nutrition

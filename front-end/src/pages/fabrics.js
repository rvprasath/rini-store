
import "../css/fabrics.css"
import satinFabric from "../images/white satin fabric.png"
import checkedFabric from "../images/pink and white checked fabric.png"
import cottonFabric from "../images/dark red cotton fabric.png"

function Fabrics() {
    return (
        <>
            <main>
                <div class="menu-header"><h2>Fabric customization</h2></div>
                <div class="fabric-list">
                    <div class="fabric-item" onclick="showDetails('white')">
                        <img src={satinFabric} alt="White Fabric" />
                            <p>Plain White Satin</p>
                    </div>
                    <div class="fabric-item" onclick="showDetails('red')">
                        <img src={checkedFabric} alt="Red Fabric" />
                            <p>Pink & White Cotton</p>

                    </div>
                    <div class="fabric-item" onclick="showDetails('black')">
                        <img src={cottonFabric} alt="Black Fabric" />
                            <p>Dark Red Cotton </p>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Fabrics;
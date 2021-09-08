<script lang="ts" context="module">
	export const prerender = false;
	const decisionTable = {
        [CROSS_STATE.BLACK]: {
            black: true,
            rotate: true,
        },
        [CROSS_STATE.SMALL_BLACK]: {
            black: true,
            rotate: true,
            small: true
        },
        [CROSS_STATE.RED]: {
            red: true,
            rotate: true
        },
        [CROSS_STATE.SMALL_RED]:{
            small: true,
            red: true,
            rotate: true
        },
        [CROSS_STATE.GREEN]: {
            green: true
        },
        [CROSS_STATE.UNDEF]: {
            green: true,
            small: true,
            rotate: true
        },
        _default: {
            black: false,
            green: false,
            red: false,
            rotate: false,
            small: false
        }
    };
</script>

<script lang="ts">
    import { CROSS_STATE } from './enums';
	
	export let state: CROSS_STATE;

    let black: boolean;
    let green: boolean;
    let red: boolean;
    let rotate: boolean;
    let small: boolean;

    $:{
        const st = Object.assign({}, decisionTable['_default'], decisionTable[state]);
        small = st.small;
        rotate = st.rotate;
        black = st.black;
        red = st.red;
        green = st.green;
        console.log({ small, rotate, black, red, state});
    }
	
</script>


<div class:cross={true} class:rotate class:small class:green class:red class:black on:click>
	<svg version="1.1" viewBox="0 0 42 42">
		<line class="lcl" x1="21" y1="0" x2="21" y2="42"></line>
		<line class="lcl" x1="42" y1="21" x2="0" y2="21"></line>
	</svg>
</div>

<style>
.cross>svg {
    transition: all 0.2s linear;
}

.cross {
    width: 44px;
    height: 44px;
    position: relative;
    flex-grow:0;
    flex-shrink: 0;
}

.cross.small {
    width: 30px;
    height: 30px;
}

.cross > svg {
    position: absolute;
    left: 10%;
    top: 10%;
    width: 80%;
    height: 80%;
}

.cross.green >svg line.lcl {
    fill: none;
    stroke: #23A24D;
    stroke-width: 2px;
}

.cross.red > svg line.lcl {
    fill: none;
    stroke: #C5411E;
    stroke-width: 2px;
}

.cross.black > svg line.lcl {
    fill: none;
    stroke: #000;
    stroke-width: 4px;
}

.cross.rotate > svg {
  transform: rotate(45deg);
}


.cross.black > svg {
    left: 20%;
    top: 20%;
    width: 60%;
    height: 60%;
}


.cross.black > svg line.lcl {
    fill: none;
    stroke: #000;
    stroke-width: 4px;
}

</style>
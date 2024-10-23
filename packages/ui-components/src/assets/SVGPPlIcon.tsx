import styles from './svg.module.css';
import './svg.css';

export type SVGProperties = {
  style: Record<string, string>;
}

export default function SVGPPlIcon(props: SVGProperties) {
  console.log('prop passing: %o', Object.fromEntries(Object.entries(props.style)));
  
  console.log('svg styles: %o', Object.fromEntries(Object.entries(styles)));
  
    return (
<svg style={props.style} className={`${styles.svgpeopleIcon} ${styles['abc:hover']}`} focusable="false" color="transparent" aria-hidden="true" viewBox="0 0 20 20">
  <path d="M12.82 13.8574C14.06 12.6366 15.76 11.8762 17.64 11.8762C17.68 11.8762 17.73 11.8862 17.77 11.8862" 
      stroke="#1436D3" strokeLinecap="round" strokeLinejoin="round"></path>
  <path d="M16.33 5.12195C15.57 5.57223 15.06 6.39274 15.06 7.34334C15.06 8.77423 16.22 9.93496 17.65 9.93496C17.77 9.93496 17.89 9.91494 18 9.89493" stroke="#1436D3" strokeLinecap="round" strokeLinejoin="round"></path>
  <path d="M7.21001 13.8874C5.96001 12.6466 4.26001 11.8762 2.36001 11.8762C2.32001 11.8762 2.27001 11.8862 2.23001 11.8862" stroke="#1436D3" strokeLinecap="round" strokeLinejoin="round"></path>
  <path d="M2.01001 9.88492C2.12001 9.90494 2.24001 9.92495 2.36001 9.92495C3.79001 9.92495 4.95001 8.76422 4.95001 7.33333C4.95001 6.38273 4.44001 5.56222 3.68001 5.11194" stroke="#1436D3" strokeLinecap="round" strokeLinejoin="round"></path>
  <path d="M15.08 15.4684C14.45 14.788 13.68 14.2376 12.83 13.8574C11.98 13.4772 11.04 13.267 10.05 13.267C9.03999 13.267 8.07999 13.4872 7.21999 13.8774C6.38999 14.2576 5.63999 14.798 5.01999 15.4584" stroke="#F20738" strokeLinecap="round" strokeLinejoin="round"></path>
  <path d="M12.63 8.7342C12.63 7.3033 11.47 6.14258 10.04 6.14258C8.61001 6.14258 7.45001 7.3033 7.45001 8.7342C7.45001 10.1651 8.61001 11.3258 10.04 11.3258C11.47 11.3258 12.63 10.1651 12.63 8.7342Z" stroke="#F20738" strokeLinecap="round" strokeLinejoin="round"></path>
  <path d="M2.23 11.8762C2.56 13.237 3.23 14.4678 4.16 15.4584C5.62 17.0194 7.69 18 10 18C12.31 18 14.38 17.0194 15.84 15.4584C16.77 14.4678 17.44 13.237 17.77 11.8762C17.92 11.2758 18 10.6454 18 10.005C18 9.96498 17.99 9.92495 17.99 9.88493C17.96 8.0838 17.35 6.44278 16.32 5.11194C14.86 3.22076 12.58 2 10 2C7.42 2 5.14 3.22076 3.67 5.12195C2.65 6.44278 2.03 8.09381 2.01 9.88493C2.01 9.92495 2 9.96498 2 10.005C2 10.6554 2.09 11.2758 2.23 11.8762Z" stroke="#1436D3" strokeLinecap="round" strokeLinejoin="round"></path>
</svg>);
}

/*
var(--deep-royal-blue: '#1436D3')
*/
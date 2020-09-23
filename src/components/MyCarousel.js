export class MyCarousel extends Component {
  constructor(props){
    super(props);
  }
    _renderItem = ({item, index}) => {
        return (
            <View style={styles.slide}>
                <Text style={styles.title}>{ item.title }</Text>
            </View>
        );
    }
    render () {
        return (
            <Carousel
              ref={(c) => { this._carousel = c; }}
              data={props.dataEntries}
              renderItem={this._renderItem}
              sliderWidth={300}
              itemWidth={300}
            />
        );
    }
}

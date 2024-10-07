import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {FilterStyles} from './style';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { Text } from 'native-base';
import CheckBox from '@react-native-community/checkbox';
import Accordion from '../accordion';
import colors from '@config/colors';
import RangeSlider from 'rn-range-slider';

import Thumb from './Thumb';
import Rail from './Rail';
import RailSelected from './RailSelected';
import TouchableCustom from '@helpers/touchable_custom';

const Filters = ({searchInfo, defaultFilters, applyFilters}) => {
  const [modeleOpen, setModeleOpen] = useState(false);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(500000);
  const [filters, setFilters] = useState({
    category: defaultFilters?.category,
    manufacturer: defaultFilters?.manufacturer,
    rating: defaultFilters?.rating,
    price: defaultFilters?.price,
  });
  const filterCount = useMemo(() => {
    let count =
      (filters?.category?.length || 0) +
      (filters?.manufacturer?.length || 0) +
      (filters?.rating ? 1 : 0) +
      (filters?.price &&
      filters?.price?.min !== null &&
      filters?.price?.max !== null
        ? 1
        : 0);

    return count;
  }, [filters]);

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);

  const selectCategories = useCallback(
    category => {
      const categorySet = new Set(filters?.category);
      if (categorySet.has(category)) {
        categorySet.delete(category);
      } else {
        categorySet.add(category);
      }
      const newCategories = [...categorySet];
      setFilters({...filters, category: newCategories});
    },
    [filters],
  );

  const selectManufacturer = useCallback(
    manufacturer => {
      const manufacturerSet = new Set(filters?.manufacturer);
      if (manufacturerSet.has(manufacturer)) {
        manufacturerSet.delete(manufacturer);
      } else {
        manufacturerSet.add(manufacturer);
      }
      const newManufacturer = [...manufacturerSet];
      setFilters({...filters, manufacturer: newManufacturer});
    },
    [filters],
  );

  const selectRating = useCallback(
    rating => {
      let newRating = null;
      if (filters.rating !== rating) {
        newRating = rating;
      }
      setFilters({...filters, rating: newRating});
    },
    [filters],
  );

  const onValueChanged = useCallback((low, high) => {
    setLow(low);
    setHigh(high);
  }, []);

  const onValueChangeEnd = useCallback(
    (low, high) => {
      setFilters({...filters, price: {min: low, max: high}});
    },
    [filters],
  );

  const manufacturer = useMemo(() => {
    return (
      searchInfo?.filters?.filter(item => item?.key === 'manufacturer')?.[0]
        ?.value || []
    );
  }, [searchInfo?.filters]);

  const categories = useMemo(() => {
    return (
      searchInfo?.filters?.filter(item => item?.key === 'categories')?.[0]
        ?.value || []
    );
  }, [searchInfo?.filters]);

  const clearFilters = useCallback(() => {
    setFilters({});
    applyFilters({
      category: [],
      manufacturer: [],
      rating: null,
      price: {min: null, max: null},
    });
    setModeleOpen(false);
  }, []);

  const CustomRatingComponent = useCallback(() => {
    return (
      <View>
        <TouchableOpacity
          style={FilterStyles.row}
          onPress={() => setIsRatingOpen(!isRatingOpen)}>
          <Text style={[FilterStyles.title]}>Ratings</Text>
          <Icon
            name={isRatingOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={30}
            color={colors.grey}
          />
        </TouchableOpacity>
        {isRatingOpen &&
          [1, 2, 3, 4].map(rating => {
            return (
              <View
                style={{
                  fontSize: 14,
                  marginBottom: 10,
                  justifyContent: 'center',
                }}
                key={'view' + rating}>
                <TouchableOpacity
                  style={FilterStyles.checkboxContainer}
                  onPress={() => selectRating((5 - rating) * 20)}>
                  <CheckBox
                    value={filters.rating === (5 - rating) * 20}
                    tintColors={{
                      true: '#151a20',
                      false: '#666666',
                    }}
                    tintColor="#666666"
                    style={FilterStyles.checkBox}
                    boxType={'square'}
                    onFillColor={'#151a20'}
                    onCheckColor={'#FFF'}
                    disabled
                  />
                  <Text style={FilterStyles.rating}>
                    {[4, 3, 2, 1, 0].map(value => (
                      <Text
                        key={`${value}`}
                        style={
                          rating <= value
                            ? FilterStyles.fill_star
                            : FilterStyles.empty_star
                        }>
                        {'★'}
                      </Text>
                    ))}
                  </Text>
                  <Text style={FilterStyles.ratingText}>
                    {' '}
                    {5 - rating} & above
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
      </View>
    );
  }, [isRatingOpen, filters]);

  const renderItem = useCallback(
    (item, type) => {
      return (
        <TouchableOpacity
          style={FilterStyles.checkBoxContainer}
          onPress={() => {
            type === 'Manufacturer'
              ? selectManufacturer(item)
              : selectCategories(item);
          }}>
          <CheckBox
            tintColors={{
              true: '#151a20',
              false: '#666666',
            }}
            tintColor="#666666"
            style={FilterStyles.checkBox}
            boxType={'square'}
            onFillColor={'#151a20'}
            onCheckColor={'#FFF'}
            value={
              type === 'Manufacturer'
                ? filters?.manufacturer?.includes(item)
                : filters?.category?.includes(item)
            }
            onChange={() => {
              Platform.OS === 'android'
                ? type === 'Manufacturer'
                  ? selectManufacturer(item)
                  : selectCategories(item)
                : null;
            }}
          />
          <Text style={FilterStyles.checkBoxText}>{item}</Text>
        </TouchableOpacity>
      );
    },
    [filters],
  );

  return (
    <>
      <View style={FilterStyles.filterButtonWrapper}>
        <TouchableCustom
          underlayColor={'#ffffff10'}
          onPress={() => {
            setModeleOpen(true);
          }}>
          <View style={FilterStyles.filterButton}>
            <Text style={{color: 'black', fontSize: 14}}>
              FILTERS{' '}
              <Text style={FilterStyles.superText}>({filterCount})</Text>
            </Text>
          </View>
        </TouchableCustom>
        {/* <Filters
              searchInfo={searchData?.searchInfo}
              defaultFilters={filters}
              applyFilters={applyFilters}
            /> */}
      </View>

      {/* <TouchableOpacity
        style={FilterStyles.filterButton}
        onPress={() => {
          setModeleOpen(true);
        }}>
        <MCIcon name="filter-variant" size={27} color="#fff" />
        <Text style={{color: 'black', fontSize: 14}}>
          FILTERS <Text style={FilterStyles.superText}>({filterCount})</Text>
        </Text>
      </TouchableOpacity> */}
      {modeleOpen && (
        <Modal
          transparent={true}
          animationType={'fade'}
          visible={modeleOpen}
          onRequestClose={() => setModeleOpen(false)}>
          <View style={FilterStyles.container}>
            <View style={FilterStyles.content}>
              <View style={FilterStyles.header}>
                <View style={FilterStyles.filterHeading}>
                  <Text style={FilterStyles.filterHeadingText}>Filters</Text>
                </View>
                <View style={FilterStyles.filterClear}>
                  {filterCount > 0 && (
                    <TouchableOpacity
                      style={FilterStyles.clearAllFilter}
                      onPress={clearFilters}>
                      <Text style={{color: 'white', textAlign: 'center'}}>
                        Clear All
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View style={FilterStyles.body}>
                <ScrollView>
                  <View style={FilterStyles.filterContainer}>
                    <View style={FilterStyles.AccordionContainer}>
                      <Accordion
                        title="Manufacturer"
                        data={manufacturer?.sort()}
                        renderItem={renderItem}
                        isOpen={true}
                      />
                    </View>
                    <View style={FilterStyles.AccordionContainer}>
                      <Accordion
                        title="Categories"
                        data={categories?.sort()}
                        renderItem={renderItem}
                        isOpen={true}
                      />
                    </View>
                    <View style={FilterStyles.AccordionContainer}>
                      <TouchableOpacity
                        style={FilterStyles.row}
                        onPress={() => setIsPriceRangeOpen(!isPriceRangeOpen)}>
                        <Text style={[FilterStyles.title, styles.font]}>
                          Price
                        </Text>
                        <Icon
                          name={
                            isPriceRangeOpen
                              ? 'keyboard-arrow-up'
                              : 'keyboard-arrow-down'
                          }
                          size={30}
                          color={colors.grey}
                        />
                      </TouchableOpacity>
                      {isPriceRangeOpen && (
                        <>
                          <View style={styles.rangeSliderStyle}>
                            <RangeSlider
                              style={FilterStyles.rangeSliderStyle}
                              id={3}
                              disableRange={false}
                              floatingLabel
                              low={filters?.price?.min || 0}
                              high={filters?.price?.max || 500000}
                              renderThumb={renderThumb}
                              renderRail={renderRail}
                              renderRailSelected={renderRailSelected}
                              min={0}
                              max={500000}
                              step={1}
                              selectionColor="#1976d2"
                              blankColor="#abcbef"
                              onValueChanged={onValueChanged}
                              onTouchEnd={onValueChangeEnd}
                            />
                          </View>
                          <View style={FilterStyles.sliderValues}>
                            <Text style={FilterStyles.rangeText}>₹{low}</Text>
                            <Text style={FilterStyles.rangeText}>₹{high}</Text>
                          </View>
                        </>
                      )}
                    </View>
                    <View style={FilterStyles.AccordionContainer}>
                      {CustomRatingComponent()}
                    </View>
                  </View>
                </ScrollView>
              </View>
              <View style={FilterStyles.footer}>
                <TouchableOpacity
                  style={FilterStyles.cancleButton}
                  onPress={() => {
                    setModeleOpen(false);
                  }}>
                  <Text
                    style={{color: 'white', textAlign: 'center', fontSize: 15}}>
                    CANCEL
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={FilterStyles.applyButton}
                  onPress={() => {
                    applyFilters(filters);
                    setModeleOpen(false);
                  }}>
                  <Text
                    style={{color: 'white', textAlign: 'center', fontSize: 15}}>
                    APPLY
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default Filters;

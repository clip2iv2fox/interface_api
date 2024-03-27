import {
  Card,
  CardActions,
  CardHeader,
  CardTitle,
  Divider,
  Dropdown,
  DropdownItem,
  Flex,
  FlexItem,
  KebabToggle
} from '@patternfly/react-core'
import React, { useState } from 'react'
import './CardStack.css'
import { Tests } from '@app/types/Types';

type DevicesRedactorProps = {
  card: Tests;                                            // данные карточки (тестируемого)
  openModal: (flag: boolean, card: Tests) => void;         // открытие лога с передачей id тестируемого
}

const CardStack: React.FC<DevicesRedactorProps> = ({card, openModal}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);   // открытие dropdown

  // разворот при нажатии dropdown
  const dropdownItems = [
    <DropdownItem key="action" component="button" onClick={()=>openModal(true, card)}>
      Log
    </DropdownItem>,
  ];

  // наполнение карточки
  const CardInfo = () => (
    card.status == "EMPTY" ?
      <Flex
        direction={{default: 'column'}}
        style={{margin: 0}}
      >
        <FlexItem style={{margin: 0}}>Пусто</FlexItem>
        <Divider style={{width: "275px", margin: 0}}/>
      </Flex>
    :
      <Flex direction={{default: 'column'}} style={{color: "white"}}>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          direction={{default: 'row'}}
          style={{margin: 0}}
        >
          <FlexItem style={{margin: 0}}>{card.device}</FlexItem>
          <FlexItem style={{margin: 0}}>{card.percent}</FlexItem>
        </Flex>
        <Divider style={{width: "275px", margin: 0}}/>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          direction={{default: 'row'}}
          style={{margin: 0}}
        >
          <FlexItem style={{margin: 0}}>Время</FlexItem>
          <FlexItem style={{margin: 0}}>{
            card.status == "PASS" ?
              "Завершено"
            :
              card.status == "INTERACT_LOC" || card.status == "INTERACT_REM" ?
                "Действие"
              :
                card.status == "FAIL" ?
                  "Ошибка"
                :
                  card.status == "ERROR" ?
                    "Не отвечает"
                  :
                    card.status == "PROGRES" ?
                      "Тестирование"
                    :
                      "Пусто"
          }</FlexItem>
        </Flex>
      </Flex>
  )

  return(
    <Card
      isFullHeight
      isCompact
      isRounded
      className={
        card.status == "PASS" ?
          "success"
        :
          card.status == "INTERACT_LOC" || card.status == "INTERACT_REM" ?
            "loading"
          :
            card.status == "FAIL" ?
              "danger"
            :
              card.status == "ERROR" ?
                "none"
              :
                card.status == "PROGRES" ?
                  "info"
                :
                  "empty"
        }
      >
      <CardHeader>
        <CardActions>
          <Dropdown
            onSelect={() => setIsOpen(!isOpen)}
            toggle={<KebabToggle onToggle={setIsOpen}/>}
            isOpen={isOpen}
            isPlain
            dropdownItems={dropdownItems}
            position={'right'}
          />
        </CardActions>
        <CardTitle>
          <CardInfo/>
        </CardTitle>
      </CardHeader>
    </Card>
  )
};

export default CardStack